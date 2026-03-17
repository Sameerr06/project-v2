from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from quiz_api import views
from quiz_api.views import (
    superuser_login, compile_code, complete_quiz,
    complete_round1, start_round2, complete_round2, check_qualification,
    list_questions_admin, create_question, delete_question
)


def home(request):
    return HttpResponse("Welcome to the CODEVERSE Quiz App!")


urlpatterns = [
    path('', home, name='home'),
    path('api/', home, name='api_home'),
    path('admin/', admin.site.urls),

    # Student
    path('api/student/', views.create_student, name='create_student'),
    path('api/delete-student/<int:pk>/', views.delete_student, name='delete_student'),

    # Questions (use ?round=1 or ?round=2)
    path('api/questions/', views.get_questions, name='get_questions'),

    # Admin Question Management
    path('api/admin/questions/', list_questions_admin, name='list_questions_admin'),
    path('api/admin/questions/create/', create_question, name='create_question'),
    path('api/admin/questions/delete/<int:pk>/', delete_question, name='delete_question'),

    # Answers
    path('api/submit-answer/', views.submit_answer, name='submit_answer'),

    # Round control
    path('api/complete-round1/', complete_round1, name='complete_round1'),
    path('api/start-round2/', start_round2, name='start_round2'),
    path('api/complete-round2/', complete_round2, name='complete_round2'),
    path('api/check-qualification/<int:student_id>/', check_qualification, name='check_qualification'),

    # Legacy
    path('api/complete-quiz/', complete_quiz, name='complete_quiz'),

    # Leaderboard (use ?round=1 or ?round=2 or none for overall)
    path('api/leaderboard/', views.leaderboard, name='leaderboard'),

    # Admin auth
    path('api/login/', superuser_login, name='superuser_login'),

    # Compiler
    path('api/compile/', compile_code, name='compile_code'),
]
