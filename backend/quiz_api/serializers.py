from rest_framework import serializers
from .models import Student, Question, StudentAnswer


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'id', 'text', 'code_snippet',
            'option_a', 'option_b', 'option_c', 'option_d',
            'correct_option', 'round_number', 'points'
        ]


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'
