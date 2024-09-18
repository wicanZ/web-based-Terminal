# middleware.py
import logging
from datetime import datetime
from django.http import HttpResponseForbidden

class AccessControlMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path_info.lstrip('/')
        print( 'Middleware Path : ' , path )
        if request.path.startswith('/static/js/'):
            return HttpResponseForbidden('Access denied')
        
        if path.startswith('/static/commands/'):
            # Check if user is authenticated or any other condition
            if not request.user.is_authenticated:
                return HttpResponseForbidden("Access denied")

        response = self.get_response(request)
        return response
    
    
logger = logging.getLogger('user_activity_logger')

class UserActivityLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Collect user details
        user_ip = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', 'unknown')
        path = request.path
        method = request.method
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Check if user is authenticated
        if request.user.is_authenticated:
            username = request.user.username
        else:
            username = 'Anonymous'

        # Log user activity
        logger.info(f'{timestamp} | {method} {path} | IP: {user_ip} | User-Agent: {user_agent} | User: {username}')
        # print(f'{timestamp} | {method} {path} | IP: {user_ip} | User-Agent: {user_agent} | User: {username}')

        # Call the next middleware or view
        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        """Extract the client's IP address from the request headers."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
