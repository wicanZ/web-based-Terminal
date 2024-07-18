from django.urls import path
from . import views

urlpatterns = [
    path('' , views.Homepage , name='home') ,
    path('doc/' , views.document , name='doc') ,
    path('execute_command/', views.execute_command, name='execute_command'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('list_commands/', views.list_commands, name='list_commands'),
    path('login_status/', views.check_login_status, name='login_status'),


    path('save_command/', views.save_command, name='save_command'),
    
    path('upload_file/', views.upload_file, name='upload_file'), 
    path('resume/', views.serve_resume, name='serve_resume'),
    
    
    path('api/login_status_anonymous/', views.check_login_status_anonymous, name='login_status_anonymous'),
    path('upload_command/', views.upload_command, name='upload_command'),
    path('save_file/', views.save_file, name='save_file'),
    
    
    path('api/execute_python_script/<str:script_name>/', views.execute_python_script, name='execute_python_script'),
]
