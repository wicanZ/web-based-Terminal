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

    path('get_file/' , views.get_file , ) ,
    path('save_file/', views.save_file_vim , name='save_file'),
    path('get_filecommand/<str:file_name>/', views.get_filecommand, name='get_file'),
    path('save_command/', views.save_command, name='save_command'),

    path('get_quiz_start_time/', views.get_quiz_start_time, name='get_quiz_start_time'),
    path('save_quiz_result/', views.save_quiz_result, name='save_quiz_result'),
    path('get_quiz_results/', views.get_quiz_results, name='get_quiz_results'),


    
    
    path('upload_file/', views.upload_file, name='upload_file'), 
    path('resume/', views.serve_resume, name='serve_resume'),
    
    
    path('api/login_status_anonymous/', views.check_login_status_anonymous, name='login_status_anonymous'),
    path('upload_command/', views.upload_command, name='upload_command'),
    path('save_file/kooko/', views.save_file, name='save_file'),
    
    
    path('api/execute_python_script/<str:script_name>/', views.execute_python_script, name='execute_python_script'),


    # ctf url 
    path('ctf/' , views.ctf_home , name='ctf'),
    path('programming_challenge/', views.programming_challenge, name='programming_challenge'),
    path('validate_file_search/', views.validate_file_search, name='validate_file_search'),
    path('validate_xss/', views.validate_xss, name='validate_xss'),
    path('validate_physical_security/', views.validate_physical_security, name='validate_physical_security'),
    path('validate_brute_force/', views.validate_brute_force, name='validate_brute_force'),
    path('validate_sql_injection/', views.validate_sql_injection, name='validate_sql_injection'),
    path('validate_hash_crack/', views.validate_hash_crack, name='validate_hash_crack'),
    path('validate_reverse_engineering/', views.validate_reverse_engineering, name='validate_reverse_engineering'),
    path('validate_steganography/', views.validate_steganography, name='validate_steganography'),
    path('validate_forensics/', views.validate_forensics, name='validate_forensics'),
    path('validate_web_exploitation/', views.validate_web_exploitation, name='validate_web_exploitation'),
    path('submit_flag/', views.submit_flag, name='submit_flag'),
]
