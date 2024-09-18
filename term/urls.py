from django.urls import path
from . import views
from .views import ObtainAuthToken 

urlpatterns = [
    path('api/token/', ObtainAuthToken.as_view(), name='obtain_token'),
    path('' , views.Homepage , name='home') ,
    path('doc/' , views.document , name='doc') ,
    
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'), 
    #path('fetch-command/<str:command_name>/', views.fetch_command, name='fetch_command'),
    path('login_status/', views.check_login_status, name='login_status'),
    
    path('execute_command/', views.execute_command, name='execute_command'),
    path('list-commands/', views.list_commands, name='list_commands'),  # Direct path without 'api/'
    

    # path('get_file/' , views.get_file , ) ,
    # path('save_file/', views.save_file_vim , name='save_file'),
    # path('get_filecommand/<str:file_name>/', views.get_filecommand, name='get_file'),
    # path('save_command/', views.save_command, name='save_command'),



    #path('api/command/<str:command_name>/', views.get_command_file, name='get_command_file'),
    path('api/submit-report/', views.add_report, name='add_report'),
    #path('api/submit-report/', views.submit_report, name='submit_report'),
    path('api/reports/', views.list_reports, name='list_reports'),
    path('api/report/<int:report_id>/', views.get_report, name='get_report'),
    path('api/report/update/<int:report_id>/', views.update_report, name='update_report'),
    path('api/report/delete/<int:report_id>/', views.delete_report, name='delete_report'),


    # path('get_quiz_start_time/', views.get_quiz_start_time, name='get_quiz_start_time'),
    # path('save_quiz_result/', views.save_quiz_result, name='save_quiz_result'),
    # path('get_quiz_results/', views.get_quiz_results, name='get_quiz_results'),


    
    
    # path('upload_file/', views.upload_file, name='upload_file'), 
    # # path('resume/', views.serve_resume, name='serve_resume'),
    
    
    # path('api/login_status_anonymous/', views.check_login_status_anonymous, name='login_status_anonymous'),
    # path('upload_command/', views.upload_command, name='upload_command'),
    # path('save_file/kooko/', views.save_file, name='save_file'),
    
    
    # path('api/execute_python_script/<str:script_name>/', views.execute_python_script, name='execute_python_script'),
    
    # event urls 
    # path('create_event/', views.create_event, name='create_event'),
    # path('get_events/', views.get_events, name='get_events'),


    # ctf url 
    # path('ctf/' , views.ctf_home , name='ctf'),
    # path('programming_challenge/', views.programming_challenge, name='programming_challenge'),
    # path('validate_file_search/', views.validate_file_search, name='validate_file_search'),
    # path('validate_xss/', views.validate_xss, name='validate_xss'),
    # path('validate_physical_security/', views.validate_physical_security, name='validate_physical_security'),
    # path('validate_brute_force/', views.validate_brute_force, name='validate_brute_force'),
    # path('validate_sql_injection/', views.validate_sql_injection, name='validate_sql_injection'),
    # path('validate_hash_crack/', views.validate_hash_crack, name='validate_hash_crack'),
    # path('validate_reverse_engineering/', views.validate_reverse_engineering, name='validate_reverse_engineering'),
    # path('validate_steganography/', views.validate_steganography, name='validate_steganography'),
    # path('validate_forensics/', views.validate_forensics, name='validate_forensics'),
    # path('validate_web_exploitation/', views.validate_web_exploitation, name='validate_web_exploitation'),
    # path('submit_flag/', views.submit_flag, name='submit_flag'),




    # path('search/<str:app_name>/', search_app, name='search_app'),
    # path('view/<str:app_name>/', view_app, name='view_app'),
    # path('install/<str:app_name>/', install_app, name='install_app'),
    # path('list/installed/', list_installed_apps, name='list_installed_apps'),

    # path('commands/create/', create_command, name='create_command'),
    # path('commands/update/<int:command_id>/', update_command, name='update_command'),
    # path('commands/list/', list_commands, name='list_commands'),
]
