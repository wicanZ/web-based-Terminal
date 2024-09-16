from django.shortcuts import render , redirect , get_object_or_404 
from django.http import JsonResponse , FileResponse ,HttpResponseForbidden ,HttpResponse ,HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import os , subprocess
import json
import shutil
import json
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
# Create your views here.
from webterm import settings
import datetime
from django.utils import timezone
from django.core.files.storage import FileSystemStorage
from .models import QuizResult , Event , UserCommand 
from django.utils.dateparse import parse_date

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# for token generate 

class ObtainAuthToken(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'This is a protected view accessible only with a valid token.'})



# quiz test 

QUIZ_START_TIME = timezone.now() + timezone.timedelta(minutes=1)
RESULT_AVAILABLE_TIME = QUIZ_START_TIME + timezone.timedelta(minutes=10)



def get_quiz_start_time(request):
    return JsonResponse({'start_time': QUIZ_START_TIME.isoformat()})

def save_quiz_result(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        score = data.get('score')
        try:
            user = User.objects.get(username=username)
            quiz_result = QuizResult.objects.create(user=user, score=score)
            return JsonResponse({'success': True})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'})
    return JsonResponse({'success': False})

def get_quiz_results(request):
    if timezone.now() < RESULT_AVAILABLE_TIME:
        return JsonResponse({'results': [], 'result_available_time': RESULT_AVAILABLE_TIME.isoformat()})

    results = QuizResult.objects.all().order_by('-score')
    results_data = [{'username': result.user.username, 'score': result.score} for result in results]
    return JsonResponse({
        'results': results_data,
        'result_available_time': RESULT_AVAILABLE_TIME.isoformat()
    })


def Homepage(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    #print(user_agent)
    # if user_agent.startswith('Mozilla/5.0') :
    #     response = 'hello world'
    #     return JsonResponse({'response': response})
    return render(request, 'index.html')

def document( request ) :
    template = 'document.html'
    return render(request  ,template, context={})

def ctf_home(request) :
    template = 'ctfdocument.html'
    return render(request  ,template, context={})




# # In-memory file system structure
# file_system = {
#     '/': {
#         'type': 'dir',
#         'contents': {
#             'dir1': {'type': 'dir', 'contents': {}},
#             'file1.txt': {'type': 'file', 'contents': 'This is file1.'}
#         }
#     }
# }

# Path to the root of the simulated file system
ROOT_PATH = '/home/tsh/webstar' #'/tmp/terminal_root'

# Ensure the root directory exists
os.makedirs(ROOT_PATH, exist_ok=True)

# Path to the command history log file
HISTORY_LOG = os.path.join(ROOT_PATH, 'history.log')

def details(request):
    data = {}
    data['path'] = request.path
    data['method'] = request.method
    data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
    data['ip_address'] = request.META.get('REMOTE_ADDR', '')
    
    if request.user.is_authenticated:
        data['user'] = request.user.username
        data['user_email'] = request.user.email
        data['user_roles'] = ','.join(request.user.groups.values_list('name', flat=True))
        # Add more user-related information as needed
    
    # Add more request meta information as needed
    data['referer'] = request.META.get('HTTP_REFERER', '')
    data['accept_language'] = request.META.get('HTTP_ACCEPT_LANGUAGE', '')
    
    # Example of logging session information
    if hasattr(request, 'session'):
        data['session_id'] = request.session.session_key
        data['session_start'] = request.session.get('_session_start_time')
        # Add more session-related information as needed
    
    return data


def log_command(request, commands, current_dir):
    timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(HISTORY_LOG, 'a') as log_file:
        for command in commands:
            data = details(request)
            log_file.write(f'+ ------ Request Details:\n')
            log_file.write(f'{timestamp} {current_dir} $ {commands}\n')
            for key, value in data.items():
                log_file.write(f'{key}: {value}\n')
            log_file.write('\n\n\n')

def parse_output_as_json(output):
    # Example function to parse ls output into JSON format
    lines = output.splitlines()
    data = []
    for line in lines:
        parts = line.split()
        if len(parts) >= 8:
            item = {
                'permissions': parts[0],
                'links': parts[1],
                'owner': parts[2],
                'group': parts[3],
                'size': parts[4],
                'modified': f'{parts[5]} {parts[6]} {parts[7]}',
                'name': ' '.join(parts[8:])
            }
            data.append(item)
    return data


def generate_man_page_html(command):
    man_pages = {

        'ls': {
            'name': 'ls',
            'author': 'GNU Project',
            'description': 'List directory contents',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': '--all', 'Optional': 'yes', 'Description': 'Do not ignore entries starting with .', 'Type': 'flag', 'Default': 'False'},
                {'Argument': '--long', 'Optional': 'yes', 'Description': 'Use a long listing format', 'Type': 'flag', 'Default': 'False'}
            ]
        },
        'pwd': {
            'name': 'pwd',
            'author': 'GNU Project',
            'description': 'Print name of current/working directory',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': []
        },
        'cat': {
            'name': 'cat',
            'author': 'GNU Project',
            'description': 'Concatenate and print files',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to display', 'Type': 'string', 'Default': '/'}
            ]
        },
        'mkdir': {
            'name': 'mkdir',
            'author': 'GNU Project',
            'description': 'Make directories',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'directory', 'Optional': 'no', 'Description': 'Directory to create', 'Type': 'string', 'Default': '/'}
            ]
        },
        'touch': {
            'name': 'touch',
            'author': 'GNU Project',
            'description': 'Change file timestamps',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to create/update', 'Type': 'string', 'Default': '/'}
            ]
        },
       

        'rm': {
            'name': 'rm',
            'author': 'GNU Project',
            'description': 'Remove files or directories',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to remove', 'Type': 'string', 'Default': '/'}
            ]
        },
        
 
        # Add more commands as needed
    }
    # if command in man_pages:
    #     man_page = man_pages[command]
    #     html = '<table><tr><th>name</th><td>{}</td></tr>'.format(man_page['name'])
    #     html += '<tr><th>author</th><td>{}</td></tr>'.format(man_page['author'])
    #     html += '<tr><th>description</th><td>{}</td></tr>'.format(man_page['description'])
    #     html += '<tr><th>is a game</th><td>{}</td></tr>'.format(man_page['is_a_game'])
    #     html += '<tr><th>is secret</th><td>{}</td></tr>'.format(man_page['is_secret'])
    #     html += '</table>'
        
    #     html += '<table><tr><th>Argument</th><th>Optional</th><th>Description</th><th>Type</th><th>Default</th></tr>'
    #     for arg in man_page['arguments']:
    #         html += '<tr><td>{}</td><td>{}</td><td>{}</td><td>{}</td><td>{}</td></tr>'.format(
    #             arg['Argument'], arg['Optional'], arg['Description'], arg['Type'], arg['Default']
    #         )
    #     html += '</table>'
    #     return html
    # else:
    #     return f"No manual entry for {command}"

    if command not in man_pages:
        return "<h1>Manual Page Not Found</h1>"

    man_page = man_pages[command]
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid white; padding: 8px; text-align: left; }}
            th {{ background-color: #000; }}
        </style>
    </head>
    <body>
        <h4>Manual Page for {man_page['name']}</h4>
        <table>
            <tr><th>name</th><td>{man_page['name']}</td></tr>
            <tr><th>author</th><td>{man_page['author']}</td></tr>
            <tr><th>description</th><td>{man_page['description']}</td></tr>
            <tr><th>is a game</th><td>{man_page['is_a_game']}</td></tr>
            <tr><th>is secret</th><td>{man_page['is_secret']}</td></tr>
        </table>
        <h2>Arguments</h2>
        <table>
            <tr>
                <th>Argument</th>
                <th>Optional</th>
                <th>Description</th>
                <th>Type</th>
                <th>Default</th>
            </tr>"""
    for arg in man_page['arguments']:
        html += f"""
            <tr>
                <td>{arg['Argument']}</td>
                <td>{arg['Optional']}</td>
                <td>{arg['Description']}</td>
                <td>{arg['Type']}</td>
                <td>{arg['Default']}</td>
            </tr>"""
    html += """
        </table>
    </body>
    </html>
    """
    return html

# ROOT_PATH = '/home/tsh/webstar' #'/tmp/terminal_root'
def is_path_within_base_directory(path):
    # Get the absolute path
    abs_path = os.path.abspath(path)
    # Check if the path starts with the base directory
    return abs_path.startswith(os.path.abspath(ROOT_PATH))

def normalize_path(path):
    return os.path.normpath(os.path.join(ROOT_PATH, path))

def list_directory(path):
    try:
        normalized_path = normalize_path(path)
        if not is_path_within_base_directory(normalized_path):
            return HttpResponseForbidden("Access to this directory is forbidden.")
        
        files = os.listdir(normalized_path)
        return JsonResponse({'files': files})
    except Exception as e:
        return JsonResponse({'error': str(e)})

def change_directory(request, path):
    normalized_path = normalize_path(path)
    if not is_path_within_base_directory(normalized_path):
        return HttpResponseForbidden("Access to this directory is forbidden.")
    
    try:
        os.chdir(normalized_path)
        return JsonResponse({'current_directory': normalized_path})
    except Exception as e:
        return JsonResponse({'error': str(e)})


def format_size(size):
    """
    Convert size in bytes to human-readable format (KB, MB, GB).
    """
    if size < 1024:
        return f"{size} bytes"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    elif size < 1024 * 1024 * 1024:
        return f"{size / (1024 * 1024):.1f} MB"
    else:
        return f"{size / (1024 * 1024 * 1024):.1f} GB"
    



@csrf_exempt
def execute_command(request):
    data = json.loads(request.body.decode('utf-8'))
    command = data.get('command', '').strip()
    print(command)
    current_dir = data.get('current_dir', '/')

    # Ensure current directory exists
    current_dir_path = os.path.join(ROOT_PATH, current_dir.lstrip('/'))
    os.makedirs(current_dir_path, exist_ok=True)

    parts = command.split()
    cmd = parts[0] if parts else ''
    args = parts[1:] if len(parts) > 1 else []

    response = ''
    new_current_dir = current_dir
    commandjson = command.split('|')
    output = None
    # Log the command
    log_command(request ,command, current_dir)


    if command.startswith('ls'):
        options = command.split()[1:]
        directory = current_dir_path
        formatted_files = []
        try:
            files = os.listdir(directory)
            if '-a' in options:
                files = ['.', '..'] + files
            for f in files:
                file_path = os.path.join(directory, f)
                if '-f' in options and not os.path.isfile(file_path):
                    continue  # Skip non-files if '-f' option is specified
                if os.path.isdir(file_path):
                    formatted_files.append(f"DIR: {f}")
                elif os.path.isfile(file_path):
                    if '-l' in options:
                        size = os.path.getsize(file_path)
                        size_str = format_size(size)  # Convert size to human-readable format
                        formatted_files.append(f"FILE: {f} ({size_str})")
                    else:
                        formatted_files.append(f"FILE: {f}")
            
            response = '\n'.join(formatted_files)
        except Exception as e:
            response = str(e)
    elif cmd == 'cd':
        if args:
            new_path = normalize_path(os.path.join(current_dir_path, args[0]))
            if os.path.isdir(new_path) and is_path_within_base_directory(new_path):
                new_current_dir = os.path.relpath(new_path, ROOT_PATH)
                response = f'Changed directory to: {new_path}'
            else:
                response = f'No such directory: {args[0]}' if not os.path.isdir(new_path) else 'Access to this directory is forbidden.'
        else:
            new_current_dir = '/'
            response = f'Changed directory to root: {ROOT_PATH}'
    elif cmd == 'pwd':
        response = new_current_dir

    elif cmd == 'cat':
        if args:
            file_path = os.path.join(current_dir_path, args[0])
            # Normalize and check if the file path is within ROOT_PATH
            if is_path_within_base_directory(file_path) and os.path.isfile(file_path):
                try:
                    with open(file_path, 'r') as file:
                        response = file.read()
                except Exception as e:
                    response = str(e)
            else:
                response = f'No such file or access to file is forbidden: {args[0]}'
        else:
            response = 'Usage: cat <filename>'
    # elif cmd == 'cat':
    #     if args:
    #         normalized_path = normalize_path(os.path.join(current_dir_path, args[0]))
    #         if not is_path_within_base_directory(normalized_path):
    #             response = f'No such directory: {args[0]}' if not os.path.isfile(normalized_path) else 'Access to this directory is forbidden.'
    #         else :
    #             with open(normalized_path, 'r') as file:
    #                 response = file.read()
    #         # file_path = os.path.join(current_dir_path, args[0])
    #         # normalized_path = normalize_path(os.path.join(current_dir_path, args[0]))
    #         # if not is_path_within_base_directory(normalized_path):
    #         #     response = 'not allow '#f'No such directory: {args[0]}' if not os.path.isdir(new_path) else 'Access to this directory is forbidden.'
                
    #         # elif os.path.isfile(file_path):
    #         #     with open(file_path, 'r') as file:
    #         #         response = file.read()
    #         # else:
    #         #     response = f'No such file: {args[0]}'

    #         #response = cat_file(os.path.join(current_dir, args[0]))
    #     else:
    #         response = 'Usage: cat <file_name>'
    elif cmd == 'rm':
        if args:
            target_path = os.path.join(current_dir_path, args[0])
            try:
                if os.path.isdir(target_path):
                    shutil.rmtree(target_path)
                elif os.path.isfile(target_path):
                    os.remove(target_path)
                response = f'Removed {args[0]}'
            except Exception as e:
                response = str(e)
        else:
            response = 'Usage: rm <file/directory>'
    elif cmd == 'touch':
        if args:
            file_path = os.path.join(current_dir_path, args[0])
            try:
                open(file_path, 'a').close()
                response = f'File {args[0]} created'
            except Exception as e:
                response = str(e)
        else:
            response = 'Usage: touch <file>'
    elif cmd == 'lscpu':
        try:
            result = subprocess.run(['lscpu'], capture_output=True, text=True, check=True)
            response = result.stdout
        except subprocess.CalledProcessError as e:
            response = str(e)

    elif cmd == 'echo':
        if len(args) >= 2 and args[1] == '>':
            file_path = os.path.join(current_dir_path, args[2])
            content = args[0]
            try:
                with open(file_path, 'w') as file:
                    file.write(content)
                response = f'File {args[2]} updated'
            except Exception as e:
                response = str(e)
        else:
            response = 'Usage: echo <content> > <file>'
    elif cmd == 'man':
        man_page_html = generate_man_page_html(args[0])
        response = man_page_html
        return JsonResponse({
            'response': response,
            'current_dir': new_current_dir,
            'is_html': True
        })
    elif cmd == 'mkdir':
        if args:
            dir_path = os.path.join(current_dir_path, args[0])
            try:
                os.makedirs(dir_path, exist_ok=True)
                response = f'Directory {args[0]} created'
            except Exception as e:
                response = str(e)
        else:
            response = 'Usage: mkdir <directory>'
    elif cmd == 'uploadfile':
        if args:
            # Assuming a file content is passed in the request for simplicity
            file_name = args[0]
            file_content = data.get('file_content', '')
            file_path = os.path.join(current_dir_path, file_name)
            try:
                with open(file_path, 'w') as file:
                    file.write(file_content)
                response = f'File {file_name} uploaded'
            except Exception as e:
                response = str(e)
        else:
            response = 'Usage: upload <file>'
    elif cmd == 'history':
        try:
            with open(HISTORY_LOG, 'r') as log_file:
                response = log_file.read()
        except Exception as e:
            response = str(e)
    elif cmd == 'contact':
        response = "Email: your.email@example.com\nPhone: +123456789\nLocation: Your Location"
    elif cmd.startswith('email'):
        try:
            parts = cmd.split(' ', 2)
            if len(parts) < 3:
                response = "Error: Usage: email <your_email> <message>"
            else:
                user_email = parts[1].strip()
                message = parts[2].strip()
                send_mail(
                    'Contact Form Message',
                    message,
                    user_email,  # From user email
                    ['your.email@example.com'],  # To email
                    fail_silently=False,
                )
                response = "Email sent successfully."
        except Exception as e:
            response = f"Error sending email: {str(e)}"
    elif cmd == 'cp':
        if len(args) == 2:
            src = os.path.join(current_dir_path, args[0])
            dst = os.path.join(current_dir_path, args[1])
            if is_path_within_base_directory(src) and is_path_within_base_directory(dst):
                subprocess.run(['cp', '-r', src, dst], cwd=current_dir_path)
                response = f'{args[0]} copied to {args[1]}'
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: cp <source> <destination>'
    elif cmd == 'mv':
        if len(args) == 2:
            src = os.path.join(current_dir_path, args[0])
            dst = os.path.join(current_dir_path, args[1])
            if is_path_within_base_directory(src) and is_path_within_base_directory(dst):
                subprocess.run(['mv', src, dst], cwd=current_dir_path)
                response = f'{args[0]} moved to {args[1]}'
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: mv <source> <destination>'
    elif cmd == 'grep':
        if len(args) >= 2:
            pattern = args[0]
            file_path = os.path.join(current_dir_path, args[1])
            if os.path.isfile(file_path) and is_path_within_base_directory(file_path):
                result = subprocess.run(['grep', pattern, file_path], capture_output=True, text=True)
                response = result.stdout
            else:
                response = f'No such file: {args[1]}'
        else:
            response = 'Usage: grep <pattern> <file>'
    elif cmd == 'chmod':
        if len(args) == 2:
            mode = args[0]
            file_path = os.path.join(current_dir_path, args[1])
            if is_path_within_base_directory(file_path):
                subprocess.run(['chmod', mode, file_path], cwd=current_dir_path)
                response = f'Mode of {args[1]} changed to {mode}'
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: chmod <mode> <file>'
    elif cmd == 'chown':
        if len(args) == 2:
            owner = args[0]
            file_path = os.path.join(current_dir_path, args[1])
            if is_path_within_base_directory(file_path):
                subprocess.run(['chown', owner, file_path], cwd=current_dir_path)
                response = f'Owner of {args[1]} changed to {owner}'
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: chown <owner> <file>'
    elif cmd == 'ps':
        result = subprocess.run(['ps'], capture_output=True, text=True)
        response = result.stdout

    elif cmd == 'find':
        if len(args) >= 1:
            path = args[0]
            expression = args[1] if len(args) > 1 else ''
            if is_path_within_base_directory(path):
                result = subprocess.run(['find', path, expression], capture_output=True, text=True)
                response = result.stdout
            else:
                response = 'Invalid directory path'
        else:
            response = 'Usage: find <path> [expression]'
   
    elif cmd == 'zip':
        if len(args) >= 2:
            zip_file = args[0]
            files = args[1:]
            if all(is_path_within_base_directory(os.path.join(current_dir_path, f)) for f in files):
                subprocess.run(['zip', zip_file] + files, cwd=current_dir_path)
                response = f'{zip_file} created'
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: zip <zipfile> <file1> [file2 ...]'
    elif cmd == 'unzip':
        if args:
            file_path = os.path.join(current_dir_path, args[0])
            if is_path_within_base_directory(file_path):
                subprocess.run(['unzip', file_path], cwd=current_dir_path)
                response = f'{args[0]} extracted'
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: unzip <file>'
    elif cmd == 'wget':
        if args:
            url = args[0]
            subprocess.run(['wget', url], cwd=current_dir_path)
            response = f'{url} downloaded'
        else:
            response = 'Usage: wget <url>'

    else:
        response = f'Command not found: {cmd}'

    return JsonResponse({'response': response, 'current_dir': new_current_dir , 'success': True })


@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and 'file' in request.FILES:
        file = request.FILES['file']
        current_dir = request.POST.get('current_dir', '/')
        current_dir_path = os.path.join(ROOT_PATH, current_dir.lstrip('/'))
        os.makedirs(current_dir_path, exist_ok=True)
        file_path = os.path.join(current_dir_path, file.name)
        with open(file_path, 'wb') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return JsonResponse({'response': f'File {file.name} uploaded successfully', 'current_dir': current_dir})
    return JsonResponse({'response': 'No file uploaded', 'current_dir': '/'})


# def serve_resume(request):
#     try :
#         resume_path = os.path.join('/home/tsh/jobfile/', 'Resume.pdf')  # Adjust the path accordingly
#     except Exception as e:
#         return JsonResponse({'response' : ' File does not exist '})
#     return FileResponse(open(resume_path, 'rb'), as_attachment=True, filename='resume.pdf')

# def execute_python_script(request, script_name):
#     script_path = os.path.join('python_scripts', script_name)

#     if os.path.exists(script_path) and script_name.endswith('.py'):
#         try:
#             result = subprocess.run(['python3', script_path], capture_output=True, text=True)
#             output = result.stdout.strip()  # Get stdout output
#             if result.stderr:
#                 output += '\nError:\n' + result.stderr.strip()  # Append stderr output if any
#         except Exception as e:
#             output = str(e)
#     else:
#         output = f"Script '{script_name}' not found or is not a valid Python file."

#     return JsonResponse({'output': output})

def execute_python_script(request, script_name):
    script_path = normalize_path(script_name)

    if not is_path_within_base_directory(script_path) or not script_name.endswith('.py'):
        return HttpResponseForbidden("Access to this file is forbidden.")
    
    if os.path.exists(script_path):
        try:
            result = subprocess.run(['python3', script_path], capture_output=True, text=True)
            output = result.stdout.strip()
            if result.stderr:
                output += '\nError:\n' + result.stderr.strip()
        except Exception as e:
            output = str(e)
    else:
        output = f"Script '{script_name}' not found or is not a valid Python file."

    return JsonResponse({'output': output})


from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login , logout
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest # type : ignore
from django.views.decorators.http import require_GET # type: ignore



@csrf_exempt
def check_login_status_anonymous(request):
    return JsonResponse({'logged_in': False})

# @csrf_exempt
# def upload_command(request):
#     if request.method == 'POST' and 'command' in request.FILES:
#         command_file = request.FILES['command']
#         print(command_file)

#         # Ensure the directory exists
#         directory = os.path.join(settings.BASE_DIR, 'term/static', 'commands')
#         os.makedirs(directory, exist_ok=True)

#         file_path = os.path.join(directory, command_file.name)
#         print(file_path)

#         try:
#             with open(file_path, 'wb') as f:  # Use 'wb' for binary mode
#                 for chunk in command_file.chunks():
#                     f.write(chunk)
#             return JsonResponse({"message": "Command uploaded successfully"})
#         except Exception as e:
#             return HttpResponseBadRequest(f"Failed to write file: {str(e)}")

#     return HttpResponseBadRequest("Invalid request method")

@login_required
@require_POST
@csrf_exempt
def upload_command(request):
    #if request.method == 'POST' and 'command' in request.FILES:
    if 'command_file' not in request.FILES:
        return JsonResponse({'error': 'No command file provided'}, status=400)

    command_file = request.FILES['command_file']
    file_name = request.POST.get('file_name', None)
    user_id = request.POST.get('user_id', None)
    print('============' , command_file , file_name , user_id ) ;

    if not file_name:
        return JsonResponse({'error': 'File name is required'}, status=400)
    
    if not user_id:
        return JsonResponse({'error': 'User ID is required'}, status=400)
    
    # Check if the file already exists in the 'commands/' directory
    directory = os.path.join(settings.BASE_DIR, 'term/static', 'commands')
    file_path = os.path.join(directory, file_name)
    if os.path.exists(file_path):
        return JsonResponse({'error': 'A command file with this name already exists.'}, status=400)

    # Save the command file
    fs = FileSystemStorage(location=directory)
    saved_file_path = fs.save(file_name, command_file)

    # Create the UserCommand record
    from django.contrib.auth.models import User
    user = get_object_or_404(User, username=user_id)

    command = UserCommand.objects.create(
        user=user,
        file_name=file_name,
        command_file=saved_file_path
    )
    return JsonResponse({'message': 'Command file added successfully', 'id': command.id})


@csrf_exempt
def save_file(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_name = data['fileName']
            content = data['content']
        except (KeyError, json.JSONDecodeError):
            return HttpResponseBadRequest("Invalid request data")

        file_path = os.path.join(settings.BASE_DIR, 'static', 'commands', file_name)

        with open(file_path, 'w') as f:
            f.write(content)

        return JsonResponse({"message": "File saved successfully"})

    return HttpResponseBadRequest("Invalid request method")
# ok


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            request.session['is_logged_in'] = True
            request.session['username'] = username
            return JsonResponse({'success': True, 'user': username, 'ip': get_client_ip(request) , 'message': ' Login successfully'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@login_required
def check_login_status(request):
    is_logged_in = request.user.is_authenticated
    username = request.user.username if is_logged_in else ''
    return JsonResponse({
        'is_logged_in': is_logged_in,
        'username': username,
        'ip': get_client_ip(request)
    })


@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'message': 'Username already exists'})

        user = User.objects.create_user(username=username, password=password)
        # user.save()

        # Automatically log the user in after registration
        login(request, user)
        request.session['is_logged_in'] = True
        request.session['username'] = username

        return JsonResponse({'success': True, 'user': username})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@login_required
def logout_view(request):
    # Log the user out
    #logout(request)
    # Return a response
    return JsonResponse({'message': 'You have been logged out successfully'})

def get_filecommand(request, file_name):
    print(f"Requested file: {file_name}")  # Debugging output

    # Validate file_name to prevent directory traversal attacks
    if '../' in file_name or file_name.startswith('/'):
        return JsonResponse({'error': 'Invalid file name'}, status=400)

    file_path = os.path.join('term/static', 'commands', file_name)
    print(f"File path: {file_path}")  # Debugging output

    if not os.path.isfile(file_path):
        return JsonResponse({'error': 'File not found'}, status=404)

    try:
        with open(file_path, 'r') as file:
            content = file.read()
        return JsonResponse({'content': content})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def save_command(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_name = data.get('fileName')
            content = data.get('content')

            if not file_name or not content:
                return JsonResponse({'error': 'fileName and content are required'}, status=400)

            # Validate file_name to prevent directory traversal attacks
            if '../' in file_name or file_name.startswith('/'):
                return JsonResponse({'error': 'Invalid file name'}, status=400)

            # Ensure the directory exists
            commands_dir = os.path.join('static', 'commands')
            os.makedirs(commands_dir, exist_ok=True)
            command_path = os.path.join(commands_dir, file_name)

            with open(command_path, 'w') as file:
                file.write(content)
            return JsonResponse({'message': 'File saved successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_file(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_name = data.get('fileName', '').strip()
            
            if not file_name:
                return JsonResponse({'error': 'File name is required'}, status=400)
            if '../' in file_name or file_name.startswith('/'):
                return JsonResponse({'error': 'File within dir only '}, status=400)
            
            file_path = os.path.join(ROOT_PATH, file_name)
            
            if not os.path.isfile(file_path):
                return JsonResponse({'error': 'File not found'}, status=404)
            
            with open(file_path, 'r') as file:
                content = file.read()
                
            return JsonResponse({'content': content})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return HttpResponseBadRequest('Invalid request method')

@csrf_exempt
def save_file_vim(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_name = data.get('fileName', '').strip()
            content = data.get('content', '')

            if not file_name:
                return JsonResponse({'error': 'File name is required'}, status=400)
            
            if '../' in file_name or file_name.startswith('/'):
                return JsonResponse({'error': 'Invalid file name'}, status=400)
            
            file_path = os.path.join(ROOT_PATH , file_name)

            # Ensure directory exists
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            with open(file_path, 'w') as file:
                file.write(content)
                
            return JsonResponse({'message': 'File saved successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return HttpResponseBadRequest('Invalid request method')


def list_commands(request):
    commands_dir = os.path.join(settings.BASE_DIR, 'term/static', 'commands')
    command_files = [f for f in os.listdir(commands_dir) if f.endswith('.js')]
    print('Total Command :' , len(command_files) + 1 ) 
    print('command Name : ' , command_files )
    return JsonResponse(command_files, safe=False)



def get_command_file(request, command_name):
    # Define the directory where the command files are stored
    commands_dir = os.path.join(settings.BASE_DIR, 'term/static/commands')
    
    # Define the path to the requested command file
    command_file_path = os.path.join(commands_dir, f'{command_name}.js')

    # Check if the command file exists
    if os.path.exists(command_file_path):
        with open(command_file_path, 'r') as file:
            command_content = file.read()
        return JsonResponse({'command': command_content})
    else:
        return HttpResponseNotFound(f'Command "{command_name}" not found.')

from .models import Report
import json

@require_POST
def submit_report(request):
    try:
        # Parse the incoming JSON data
        data = json.loads(request.body)
        content = data.get('content', '')
        line_number = data.get('line_number', None)

        # Ensure content and line_number are valid
        if not content or line_number is None:
            return JsonResponse({'error': 'Invalid data'}, status=400)

        # Create a new report and save it to the database
        report = Report.objects.create(content=content, line_number=line_number)

        # Return success response
        return JsonResponse({'message': 'Report submitted successfully', 'id': report.id})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
@require_POST
def add_report(request):
    try:
        # Parse the JSON data from the request
        data = json.loads(request.body)
        content = data.get('content')
        line_number = data.get('line_number')

        # Validate the input data
        if not content or line_number is None:
            return JsonResponse({'error': 'Content and line number are required'}, status=400)

        # Create the new report
        report = Report.objects.create(content=content, line_number=line_number)

        # Return a success response with the new report's ID
        return JsonResponse({'message': 'Report added successfully', 'id': report.id})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def list_reports(request):
    reports = Report.objects.all().order_by('-created_at')  # List all reports, most recent first
    report_list = [
        {
            'id': report.id,
            'content': report.content,
            'created_at': report.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'line_number': report.line_number
        }
        for report in reports
    ]
    return JsonResponse(report_list, safe=False)
def get_report(request, report_id):
    try:
        report = Report.objects.get(id=report_id)
        return JsonResponse({
            'id': report.id,
            'content': report.content,
            'created_at': report.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'line_number': report.line_number
        })
    except Report.DoesNotExist:
        return HttpResponseNotFound('Report not found')
    
@require_POST
def update_report(request, report_id):
    try:
        report = Report.objects.get(id=report_id)
        data = json.loads(request.body)
        new_content = data.get('content', report.content)  # Update content if provided
        new_line_number = data.get('line_number', report.line_number)  # Update line number if provided

        report.content = new_content
        report.line_number = new_line_number
        report.save()

        return JsonResponse({'message': f'Report {report.id} updated successfully'})
    except Report.DoesNotExist:
        return HttpResponseNotFound('Report not found')
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
@require_POST
def delete_report(request, report_id):
    try:
        report = Report.objects.get(id=report_id)
        report.delete()
        return JsonResponse({'message': f'Report {report_id} deleted successfully'})
    except Report.DoesNotExist:
        return HttpResponseNotFound('Report not found')
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
# payment 
   # 
   # 
#
# 
# client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# @csrf_exempt
# @login_required
# def initiate_payment(request):
#     if request.method == 'POST':
#         amount = int(request.POST.get('amount')) * 100  # Convert to paise
#         phone_number = request.POST.get('phone_number')

#         payment = client.order.create({
#             "amount": amount,
#             "currency": "INR",
#             "payment_capture": 1,
#         })

#         return JsonResponse({
#             "success": True,
#             "order_id": payment['id'],
#             "amount": amount,
#         })
#     return JsonResponse({"success": False, "message": "Invalid request"})

# @csrf_exempt
# @login_required
# def payment_success(request):
#     if request.method == 'POST':
#         payment_id = request.POST.get('payment_id')
#         order_id = request.POST.get('order_id')
#         signature = request.POST.get('signature')
#         amount = int(request.POST.get('amount')) / 100  # Convert to INR

#         try:
#             client.utility.verify_payment_signature({
#                 'razorpay_order_id': order_id,
#                 'razorpay_payment_id': payment_id,
#                 'razorpay_signature': signature
#             })

#             # Update user balance here
#             user = request.user
#             user.balance += amount
#             user.save()

#             # Record payment success
#             Payment.objects.create(user=user, amount=amount, status='success')

#             return JsonResponse({"success": True, "message": "Payment successful"})
#         except razorpay.errors.SignatureVerificationError:
#             # Record payment failure
#             Payment.objects.create(user=request.user, amount=amount, status='fail')

#             return JsonResponse({"success": False, "message": "Payment verification failed"})
#     return JsonResponse({"success": False, "message": "Invalid request"})
 

# app name
# from .models import App, InstalledApp

# def search_app(request, app_name):
#     apps = App.objects.filter(name__icontains=app_name)
#     app_data = [
#         {
#             'name': app.name,
#             'version': app.version,
#             'description': app.description,
#         }
#         for app in apps
#     ]
#     return JsonResponse({'apps': app_data})

# def view_app(request, app_name):
#     try:
#         app = App.objects.get(name=app_name)
#         app_data = {
#             'name': app.name,
#             'version': app.version,
#             'description': app.description,
#             'size': app.size,
#             'developer': app.developer,
#             'download_url': app.download_url,
#         }
#         return JsonResponse(app_data)
#     except App.DoesNotExist:
#         return JsonResponse({'error': 'App not found'}, status=404)

# @login_required
# def install_app(request, app_name):
#     try:
#         app = App.objects.get(name=app_name)
#         InstalledApp.objects.create(user=request.user, app=app, version=app.version)
#         return JsonResponse({'message': f'{app_name} installed successfully.'})
#     except App.DoesNotExist:
#         return JsonResponse({'error': 'App not found'}, status=404)

# @login_required
# def list_installed_apps(request):
#     installed_apps = InstalledApp.objects.filter(user=request.user)
#     app_data = [
#         {
#             'name': installed_app.app.name,
#             'version': installed_app.version,
#             'installed_at': installed_app.installed_at,
#         }
#         for installed_app in installed_apps
#     ]
#     return JsonResponse({'installed_apps': app_data})




# app 
# from django.core.exceptions import ValidationError
# from .models import Command
# 

# @login_required
# @require_POST
# def create_command(request):
#     name = request.POST.get('name')
#     description = request.POST.get('description')
#     code = request.POST.get('code')

#     # Ensure command name is unique
#     if Command.objects.filter(name=name).exists():
#         return JsonResponse({'error': 'A command with this name already exists.'}, status=400)

#     # Create the command
#     Command.objects.create(
#         name=name,
#         description=description,
#         code=code,
#         created_by=request.user
#     )
#     return JsonResponse({'message': 'Command created successfully.'})

# @login_required
# @require_POST
# def update_command(request, command_id):
#     try:
#         command = Command.objects.get(id=command_id, created_by=request.user)
#     except Command.DoesNotExist:
#         return JsonResponse({'error': 'Command not found or you do not have permission to modify it.'}, status=404)

#     command.description = request.POST.get('description', command.description)
#     command.code = request.POST.get('code', command.code)
#     command.save()
#     return JsonResponse({'message': 'Command updated successfully.'})

# @login_required
# def list_commands(request):
#     commands = Command.objects.filter(created_by=request.user)
#     command_data = [{'name': command.name, 'description': command.description} for command in commands]
#     return JsonResponse({'commands': command_data})
# ctf flag

@csrf_exempt
def programming_challenge(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user_code = data.get('code')
            exec_globals = {}
            exec_locals = {}
            exec(user_code, exec_globals, exec_locals)
            if 'find_flag' in exec_locals and exec_locals['find_flag']() == 'correct_flag':
                return JsonResponse({'success': True, 'flag': 'FLAG{programming_ctf_success}'})
            else:
                return JsonResponse({'success': False, 'message': 'Incorrect result. Try again!'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error: {str(e)}'})

    return JsonResponse({'message': 'Send a POST request with your code to solve the challenge.'})

@csrf_exempt
def validate_file_search(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        hidden_file_path = '/tmp/hidden_flag_file.txt'
        if data.get('path') == hidden_file_path:
            return JsonResponse({'success': True, 'flag': 'FLAG{file_search_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect file path. Try again!'})

@csrf_exempt
def validate_xss(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Example XSS payload check
        if '<script>alert("FLAG{example_xss_flag}");</script>' in data.get('payload', ''):
            return JsonResponse({'success': True, 'flag': 'FLAG{xss_exploit_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect XSS payload. Try again!'})
        
@csrf_exempt
def validate_physical_security(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            sequence = data.get('sequence')
            if sequence.isdigit() and is_prime(int(sequence)):
                return JsonResponse({'success': True, 'flag': 'FLAG{physical_security_success}'})
            else:
                return JsonResponse({'success': False, 'message': 'Incorrect sequence. Try again!'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error: {str(e)}'})

    return JsonResponse({'message': 'Send a POST request with your sequence to solve the challenge.'})

def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


@csrf_exempt
def validate_brute_force(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        correct_pin = '1234'  # Example PIN
        if data.get('pin') == correct_pin:
            return JsonResponse({'success': True, 'flag': 'FLAG{brute_force_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect PIN. Try again!'})

@csrf_exempt
def validate_sql_injection(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Example check for SQL injection payload
        if '1\' OR \'1\'=\'1' in data.get('injection', ''):
            return JsonResponse({'success': True, 'flag': 'FLAG{sql_injection_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect SQL injection payload. Try again!'})


@csrf_exempt
def validate_hash_crack(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data.get('input') == 'password':
            return JsonResponse({'success': True, 'flag': 'FLAG{hash_crack_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect input. Try again!'})

@csrf_exempt
def validate_reverse_engineering(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data.get('input') == 'FLAG{reverse_engineering_success}':
            return JsonResponse({'success': True, 'flag': 'FLAG{reverse_engineering_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect input. Try again!'})

@csrf_exempt
def validate_steganography(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data.get('input') == 'hidden_message':
            return JsonResponse({'success': True, 'flag': 'FLAG{steganography_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect input. Try again!'})

@csrf_exempt
def validate_forensics(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data.get('input') == 'FLAG{forensics_success}':
            return JsonResponse({'success': True, 'flag': 'FLAG{forensics_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect input. Try again!'})

@csrf_exempt
def validate_web_exploitation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data.get('input') == 'FLAG{web_exploitation_success}':
            return JsonResponse({'success': True, 'flag': 'FLAG{web_exploitation_success}'})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect input. Try again!'})


@csrf_exempt
def submit_flag(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_flag = data.get('user_flag')
        expected_flag = data.get('expected_flag')
        if user_flag == expected_flag:
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'message': 'Incorrect flag. Try again!'})

    return JsonResponse({'message': 'Send a POST request with your flag to validate it.'})


# Event views 
@csrf_exempt
def create_event(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print('- Event : ',data )
        text = data.get('text')
        date = parse_date(data.get('date'))
        if text and date:
            event = Event.objects.create(user=request.user ,text=text, date=date)
            return JsonResponse({'success': True, 'event': {'id': event.id, 'text': event.text, 'date': event.date}})
        return JsonResponse({'success': False, 'message': 'Invalid data'})
    return JsonResponse({'message': 'Send a POST request with event text and date.'})

@csrf_exempt
def get_events(request):
    if request.method == 'GET':
        events = Event.objects.all().values('id', 'text', 'date')
        return JsonResponse({'events': list(events)})
    return JsonResponse({'message': 'Send a GET request to retrieve events.'})