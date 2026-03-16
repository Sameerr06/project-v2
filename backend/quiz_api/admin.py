from django.contrib import admin
from .models import Student, Question, StudentAnswer, Leaderboard


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'round1_score', 'round2_score',
                    'total_score', 'round1_completed', 'round2_qualified', 'round2_completed')
    ordering = ('-total_score',)
    search_fields = ('name', 'email')
    list_filter = ('round1_completed', 'round2_qualified', 'round2_completed', 'current_round')
    readonly_fields = ('round1_score', 'round2_score', 'total_score')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'round1_score', 'round2_score', 'total_score', 'round2_qualified')
    ordering = ('-total_score',)
    readonly_fields = ('id', 'name', 'email', 'department', 'college', 'year',
                       'round1_score', 'round2_score', 'total_score',
                       'round1_completed', 'round2_qualified', 'round2_completed')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'text_preview', 'round_number', 'correct_option', 'points')
    list_filter = ('round_number',)
    ordering = ('round_number', 'id')

    fieldsets = (
        ('Question', {
            'fields': ('text', 'code_snippet', 'round_number', 'points')
        }),
        ('Options', {
            'fields': ('option_a', 'option_b', 'option_c', 'option_d', 'correct_option')
        }),
    )

    def text_preview(self, obj):
        return obj.text[:60] + '...' if len(obj.text) > 60 else obj.text
    text_preview.short_description = 'Question'


@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ('student', 'question', 'chosen_option', 'is_correct', 'round_number')
    list_filter = ('round_number', 'is_correct')
