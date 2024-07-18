# middleware.py

from django.http import HttpResponseForbidden

class AccessControlMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path_info.lstrip('/')
        print(path , 'path = ')
        if path.startswith('static/commands/play.js'):
            # Check if user is authenticated or any other condition
            if not request.user.is_authenticated:
                return HttpResponseForbidden("Access denied")

        response = self.get_response(request)
        return response
