from django.shortcuts import render , redirect
from django.http import JsonResponse , FileResponse ,HttpResponseForbidden ,HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import os , subprocess
import json
import shutil
import json
import datetime
from django.core.mail import send_mail
# Create your views here.
from webterm import settings



def Homepage(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    print(user_agent)
    # if user_agent.startswith('Mozilla/5.0') :
    #     response = 'hello world'
    #     return JsonResponse({'response': response})
    return render(request, 'index.html')

def document( request ) :
    template = 'document.html'
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

def generate_man_page_html(command):
    man_pages = {
        'pv': {
            'name': 'pv',
            'author': 'Noel Friedrich',
            'description': 'Print a message with a typing animation',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'message', 'Optional': 'no', 'Description': '', 'Type': 'string', 'Default': '/'}
            ]
        },
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
        'date': {
            'name': 'date',
            'author': 'GNU Project',
            'description': 'Print or set the system date and time',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': []
        },
        'time': {
            'name': 'time',
            'author': 'GNU Project',
            'description': 'Run programs and summarize system resource usage',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'command', 'Optional': 'no', 'Description': 'Command to time', 'Type': 'string', 'Default': '/'}
            ]
        },
        'calc': {
            'name': 'calc',
            'author': 'Custom Command',
            'description': 'Perform basic arithmetic operations',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'expression', 'Optional': 'no', 'Description': 'Mathematical expression to evaluate', 'Type': 'string', 'Default': '/'}
            ]
        },
        'me': {
            'name' : 'Trustful Shylla',
            'author' : 'ok',
            'description': 'sss',
            'email' : 'email',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments' : [
                {'Argument':'coding' ,'Optional': 'no', 'Description': 'Mathematical expression to evaluate', 'Type': 'string', 'Default': '/'} ,
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
        'cp': {
            'name': 'cp',
            'author': 'GNU Project',
            'description': 'Copy files and directories',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'source', 'Optional': 'no', 'Description': 'Source file or directory', 'Type': 'string', 'Default': '/'},
                {'Argument': 'destination', 'Optional': 'no', 'Description': 'Destination file or directory', 'Type': 'string', 'Default': '/'}
            ]
        },
        'mv': {
            'name': 'mv',
            'author': 'GNU Project',
            'description': 'Move (rename) files',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'source', 'Optional': 'no', 'Description': 'Source file or directory', 'Type': 'string', 'Default': '/'},
                {'Argument': 'destination', 'Optional': 'no', 'Description': 'Destination file or directory', 'Type': 'string', 'Default': '/'}
            ]
        },
        'grep': {
            'name': 'grep',
            'author': 'GNU Project',
            'description': 'Print lines that match patterns',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'pattern', 'Optional': 'no', 'Description': 'Pattern to search for', 'Type': 'string', 'Default': '/'},
                {'Argument': 'file', 'Optional': 'yes', 'Description': 'File to search in', 'Type': 'string', 'Default': '/'}
            ]
        },
        'chmod': {
            'name': 'chmod',
            'author': 'GNU Project',
            'description': 'Change file modes or Access Control Lists',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'mode', 'Optional': 'no', 'Description': 'File mode to set', 'Type': 'string', 'Default': '/'},
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to change mode of', 'Type': 'string', 'Default': '/'}
            ]
        },
        'chown': {
            'name': 'chown',
            'author': 'GNU Project',
            'description': 'Change file owner and group',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'owner', 'Optional': 'no', 'Description': 'New owner', 'Type': 'string', 'Default': '/'},
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to change owner of', 'Type': 'string', 'Default': '/'}
            ]
        },
        'ps': {
            'name': 'ps',
            'author': 'GNU Project',
            'description': 'Report a snapshot of current processes',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': []
        },
        'top': {
            'name': 'top',
            'author': 'Various',
            'description': 'Display Linux tasks',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': []
        },
        'nano': {
            'name': 'nano',
            'author': 'GNU Project',
            'description': 'Simple text editor',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to edit', 'Type': 'string', 'Default': '/'}
            ]
        },
        'vim': {
            'name': 'vim',
            'author': 'Bram Moolenaar',
            'description': 'Vi IMproved, a programmers text editor',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to edit', 'Type': 'string', 'Default': '/'}
            ]
        },
        'echo': {
            'name': 'echo',
            'author': 'GNU Project',
            'description': 'Display a line of text',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'text', 'Optional': 'no', 'Description': 'Text to display', 'Type': 'string', 'Default': '/'}
            ]
        },
        'find': {
            'name': 'find',
            'author': 'GNU Project',
            'description': 'Search for files in a directory hierarchy',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'path', 'Optional': 'no', 'Description': 'Path to search', 'Type': 'string', 'Default': '/'},
                {'Argument': 'expression', 'Optional': 'no', 'Description': 'Expression to search for', 'Type': 'string', 'Default': '/'}
            ]
        },
        'tar': {
            'name': 'tar',
            'author': 'GNU Project',
            'description': 'Store, list, or extract files in an archive',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'Tar file to operate on', 'Type': 'string', 'Default': '/'},
                {'Argument': '--create', 'Optional': 'yes', 'Description': 'Create a new archive', 'Type': 'flag', 'Default': 'False'},
                {'Argument': '--extract', 'Optional': 'yes', 'Description': 'Extract files from an archive', 'Type': 'flag', 'Default': 'False'}
            ]
        },
        'gzip': {
            'name': 'gzip',
            'author': 'GNU Project',
            'description': 'Compress files',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to compress', 'Type': 'string', 'Default': '/'}
            ]
        },
        'gunzip': {
            'name': 'gunzip',
            'author': 'GNU Project',
            'description': 'Decompress files',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to decompress', 'Type': 'string', 'Default': '/'}
            ]
        },
        'zip': {
            'name': 'zip',
            'author': 'Info-ZIP',
            'description': 'Package and compress files',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to compress', 'Type': 'string', 'Default': '/'}
            ]
        },
        'unzip': {
            'name': 'unzip',
            'author': 'Info-ZIP',
            'description': 'Extract compressed files',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'file', 'Optional': 'no', 'Description': 'File to extract', 'Type': 'string', 'Default': '/'}
            ]
        },
        'wget': {
            'name': 'wget',
            'author': 'GNU Project',
            'description': 'Retrieve files from the web',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'url', 'Optional': 'no', 'Description': 'URL to retrieve', 'Type': 'string', 'Default': '/'}
            ]
        },
        'curl': {
            'name': 'curl',
            'author': 'Daniel Stenberg',
            'description': 'Transfer data from or to a server',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'url', 'Optional': 'no', 'Description': 'URL to transfer data from/to', 'Type': 'string', 'Default': '/'}
            ]
        },
        'ssh': {
            'name': 'ssh',
            'author': 'OpenSSH',
            'description': 'OpenSSH remote login client',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'host', 'Optional': 'no', 'Description': 'Host to connect to', 'Type': 'string', 'Default': '/'}
            ]
        },
        'scp': {
            'name': 'scp',
            'author': 'OpenSSH',
            'description': 'Secure copy (remote file copy program)',
            'is_a_game': 'no',
            'is_secret': 'no',
            'arguments': [
                {'Argument': 'source', 'Optional': 'no', 'Description': 'Source file to copy', 'Type': 'string', 'Default': '/'},
                {'Argument': 'destination', 'Optional': 'no', 'Description': 'Destination to copy to', 'Type': 'string', 'Default': '/'}
            ]
        }
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


    if cmd.startswith('ls'):
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
        response = current_dir
    elif cmd == 'cat':
        if args:
            normalized_path = normalize_path(os.path.join(current_dir_path, args[0]))
            if not is_path_within_base_directory(normalized_path):
                response = f'No such directory: {args[0]}' if not os.path.isfile(normalized_path) else 'Access to this directory is forbidden.'
            else :
                with open(normalized_path, 'r') as file:
                    response = file.read()
            # file_path = os.path.join(current_dir_path, args[0])
            # normalized_path = normalize_path(os.path.join(current_dir_path, args[0]))
            # if not is_path_within_base_directory(normalized_path):
            #     response = 'not allow '#f'No such directory: {args[0]}' if not os.path.isdir(new_path) else 'Access to this directory is forbidden.'
                
            # elif os.path.isfile(file_path):
            #     with open(file_path, 'r') as file:
            #         response = file.read()
            # else:
            #     response = f'No such file: {args[0]}'

            #response = cat_file(os.path.join(current_dir, args[0]))
        else:
            response = 'Usage: cat <file_name>'
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
    elif cmd == 'pv':
        if args:
            response = ''# .join(args)
        else:
            response = 'ParseError: argument "message" (string) is missing'
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
    elif cmd == 'help':
        response = (
            "Available commands:\n"
            "ls - list directory contents\n"
            "cd <directory> - change the current directory\n"
            "pwd - print the current directory\n"
            "cat <file> - display the contents of a file\n"
            "rm <file/directory> - remove a file or directory\n"
            "touch <file> - create an empty file\n"
            "echo <content> > <file> - write content to a file\n"
            "mkdir <directory> - create a new directory\n"
            "upload <file> - upload a file\n"
            "history - show command history\n"
            "help - show this help message"
        )
    elif cmd == 'about':
            response = "This is a terminal emulator web app. Developed by [Your Name]."
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
    elif cmd.startswith('calc'):
        expression = cmd[5:]
        try:
            result = eval(expression)
            response = f"Result: {result}"
        except Exception as e:
            response = f"Error: Invalid expression"
    elif cmd == 'date':
        response = datetime.datetime.now().strftime('%Y-%m-%d')
    elif cmd == 'time':
        response = datetime.datetime.now().strftime('%H:%M:%S')
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
    elif cmd == 'top':
        result = subprocess.run(['top', '-b', '-n', '1'], capture_output=True, text=True)
        response = result.stdout
    elif cmd == 'nano':
        response = 'Nano is a text editor and cannot be run in this environment'
    elif cmd == 'vim':
        response = 'Vim is a text editor and cannot be run in this environment'
    elif cmd == 'echo':
        response = ' '.join(args)
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
    elif cmd == 'tar':
        if len(args) >= 2:
            option = args[0]
            file_path = args[1]
            if is_path_within_base_directory(file_path):
                result = subprocess.run(['tar', option, file_path], capture_output=True, text=True)
                response = result.stdout
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: tar <option> <file>'
    elif cmd == 'gzip':
        if args:
            file_path = os.path.join(current_dir_path, args[0])
            if is_path_within_base_directory(file_path):
                subprocess.run(['gzip', file_path], cwd=current_dir_path)
                response = f'{args[0]} compressed'
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: gzip <file>'
    elif cmd == 'gunzip':
        if args:
            file_path = os.path.join(current_dir_path, args[0])
            if is_path_within_base_directory(file_path):
                subprocess.run(['gunzip', file_path], cwd=current_dir_path)
                response = f'{args[0]} decompressed'
            else:
                response = 'Invalid file path'
        else:
            response = 'Usage: gunzip <file>'
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
    elif cmd == 'curl':
        if args:
            url = args[0]
            result = subprocess.run(['curl', url], capture_output=True, text=True)
            response = result.stdout
        else:
            response = 'Usage: curl <url>'
    elif cmd == 'ssh':
        response = 'SSH cannot be run in this environment'
    elif cmd == 'scp':
        response = 'SCP cannot be run in this environment'
    elif cmd == 'lscpus':
        print('start')
        response = """s
        +------------------------+--------------------------------------+
        | logical cpu cores      | 4                                    |  
        | platform (guess)       | Linux x86_64                         |  
        | cpu clockspeed (guess) | 1.1 ghz                              |  
        | gpu vendor             | Intel                                |  
        | gpu renderer           | Intel(R) HD Graphics 400, or similar |  
        +----+----------------------+--------------------------------------+
        """
    elif cmd == 'shutdown':
        response = (
            "Shutting down..........\n"
            "Initiating Shutdown Process......\n"
        )
        for i in range(10, 0, -1):
            response += f"{i} Seconds left\n"
        response += (
            "...?\n"
            "Why didn't anything happen?\n"
            "I guess this is just a website.\n"
            "Let's just not shutdown. Have a good day!\n"
        )
    # elif cmd == 'json':
    #         # Example: Format output as JSON
    #         result = subprocess.run(['ls', '-l'], stdout=subprocess.PIPE)
    #         output = result.stdout.decode('utf-8')
    #         if output:
    #             data = parse_output_as_json(output)
    #             response = json.dumps(data, indent=4)
    #         else:
    #             response = '{"error": "No output to format as JSON"}'
    elif command.startswith('json'):
        subcommand = args[0] if args else None
        if subcommand == 'ls':
            response_data = {
                'files': ['file1.txt', 'file2.txt', 'file3.txt'],
                'directories': ['dir1', 'dir2'],
            }
        elif subcommand == 'help':
            response_data = {
                'message': 'JSON command help:',
                'commands': ['ls - List files and directories', 'help - Show this help message', 'ip - Get IP address']
            }
        elif subcommand == 'ip':
            # Example of getting client IP address
            client_ip = request.META.get('REMOTE_ADDR', None)
            response_data = {
                'ip': client_ip
            }
        else:
            return JsonResponse({'response': f'Unknown subcommand: {subcommand}'}, status=400)
    elif cmd =='kill':
        try:
            process_name_or_id = ' '.join(args)
            print(process_name_or_id)
            # Execute the kill command with subprocess
            result = subprocess.run(['kill', process_name_or_id], capture_output=True, text=True)
            if result.returncode == 0:
                return JsonResponse({'response': f'Successfully killed process {process_name_or_id}'})
            else:
                return JsonResponse({'response': f'Failed to kill process {process_name_or_id}', 'error': result.stderr}, status=500)
        except Exception as e:
            return JsonResponse({'response': f'Error executing kill command: {str(e)}'}, status=500)
    elif cmd =='whoami':
        response = 'quest'
    else:
        response = f'Command not found: {cmd}'

    return JsonResponse({'response': response, 'current_dir': new_current_dir})

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and 'file' in request.FILES:
        file = request.FILES['file']
        print(file)
        current_dir = request.POST.get('current_dir', '/')
        current_dir_path = os.path.join(ROOT_PATH, current_dir.lstrip('/'))
        os.makedirs(current_dir_path, exist_ok=True)
        file_path = os.path.join(current_dir_path, file.name)
        with open(file_path, 'wb') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return JsonResponse({'response': f'File {file.name} uploaded successfully', 'current_dir': current_dir})
    return JsonResponse({'response': 'No file uploaded', 'current_dir': '/'})


    

def serve_resume(request):
    try :
        resume_path = os.path.join('/home/tsh/jobfile/', 'Resume.pdf')  # Adjust the path accordingly
    except Exception as e:
        return JsonResponse({'response' : ' File does not exist '})
    return FileResponse(open(resume_path, 'rb'), as_attachment=True, filename='resume.pdf')

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
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest




@csrf_exempt
def check_login_status_anonymous(request):
    return JsonResponse({'logged_in': False})

@csrf_exempt
def upload_command(request):
    if request.method == 'POST' and 'command' in request.FILES:
        command_file = request.FILES['command']
        print(command_file)

        # Ensure the directory exists
        directory = os.path.join(settings.BASE_DIR, 'term/static', 'commands')
        os.makedirs(directory, exist_ok=True)

        file_path = os.path.join(directory, command_file.name)
        print(file_path)

        try:
            with open(file_path, 'wb') as f:  # Use 'wb' for binary mode
                for chunk in command_file.chunks():
                    f.write(chunk)
            return JsonResponse({"message": "Command uploaded successfully"})
        except Exception as e:
            return HttpResponseBadRequest(f"Failed to write file: {str(e)}")

    return HttpResponseBadRequest("Invalid request method")

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
    is_logged_in = request.session.get('is_logged_in', False)
    username = request.session.get('username', '')
    return JsonResponse({'is_logged_in': is_logged_in, 'username': username, 'ip': get_client_ip(request)})


@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'message': 'Username already exists'})

        user = User.objects.create_user(username=username, password=password)
        user.save()

        # Automatically log the user in after registration
        login(request, user)
        request.session['is_logged_in'] = True
        request.session['username'] = username

        return JsonResponse({'success': True, 'user': username})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

@csrf_exempt
def save_command(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        file_name = data.get('fileName')
        content = data.get('content')

        if file_name and content:
            command_path = os.path.join('static', 'commands', file_name)
            try:
                with open(command_path, 'w') as file:
                    file.write(content)
                return JsonResponse({'status': 'success'}, status=200)
            except IOError as e:
                return JsonResponse({'error': str(e)}, status=500)
        return JsonResponse({'error': 'Invalid request'}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)



def list_commands(request):
    commands_dir = os.path.join(settings.BASE_DIR, 'term/static', 'commands')
    command_files = [f for f in os.listdir(commands_dir) if f.endswith('.js')]
    return JsonResponse(command_files, safe=False)