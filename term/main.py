from django.http import JsonResponse, HttpResponseForbidden

def detect_user_agent(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()

    # Dictionary of allowed user agents
    allowed_user_agents = {
        'curl': 'curl',
        #'wget': 'wget',
        'python-requests': 'python-requests',
        #'python-urllib': 'python-urllib',
        #'java': 'java',
        'chrome': 'chrome',
        'firefox': 'firefox',
        #'go-http-client': 'go-http-client',
        #'axios': 'axios',
        'postman': 'postmanruntime',
        #'powershell': 'windows powershell',
        #'libwww-perl': 'libwww-perl',
        #'openssl': 'openssl',
        #'apache-http-client': 'apache-httpclient',
    }

    # Check if the request User-Agent matches any in the allowed list
    for key, agent in allowed_user_agents.items():
        if agent in user_agent:
            return True  # Allowed user agent detected, allow access
    
    # If no known user agent is detected, block the request
    return False  # Block access due to unknown User-Agent

    # Return a JSON response with the detected User-Agent if allowed
    #return JsonResponse({'detected_user_agent': detected_user_agent, 'raw_user_agent': user_agent})


def request_info(request):
    # Get the user's IP address
    ip_address = request.META.get('REMOTE_ADDR')
    
    # Get the user's user agent
    user_agent = request.META.get('HTTP_USER_AGENT', 'Unknown')
    
    # Get the request method (GET, POST, etc.)
    request_method = request.method
    
    # Get the requested path
    request_path = request.path
    
    # Get the full URL
    full_url = request.build_absolute_uri()
    
    # Get the HTTP headers
    headers = {key: value for key, value in request.META.items() if key.startswith('HTTP_')}
    
    # Prepare the data to return
    data = {
        'ip_address': ip_address,
        'user_agent': user_agent,
        'method': request_method,
        'path': request_path,
        'full_url': full_url,
        'headers': headers,
    }
    
    return data