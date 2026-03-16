from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100)
    college = models.CharField(max_length=100)
    year = models.CharField(max_length=20)

    # Scoring
    round1_score = models.IntegerField(default=0)
    round2_score = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)

    # Round tracking
    current_round = models.IntegerField(default=1)        # 1 or 2
    round1_completed = models.BooleanField(default=False)
    round2_qualified = models.BooleanField(default=False)
    round2_completed = models.BooleanField(default=False)

    # Timing (for speed bonus)
    round1_start_time = models.DateTimeField(null=True, blank=True)
    round1_end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.email})"


class Question(models.Model):
    ROUND_CHOICES = [
        (1, 'Round 1 - MCQ'),
        (2, 'Round 2 - Code Debugging'),
    ]

    text = models.TextField()
    code_snippet = models.TextField(blank=True, null=True)
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_option = models.CharField(max_length=1)   # 'A', 'B', 'C', or 'D'

    # Round assignment
    round_number = models.IntegerField(choices=ROUND_CHOICES, default=1)

    # Round 2 specific
    points = models.IntegerField(default=10)          # configurable per question

    def __str__(self):
        return f"[Round {self.round_number}] {self.text[:60]}"


class StudentAnswer(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    chosen_option = models.CharField(max_length=1)
    is_correct = models.BooleanField(default=False)
    round_number = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.student} - Q{self.question.id} - Round {self.round_number}"


class Leaderboard(Student):
    """Proxy model for admin leaderboard view."""
    class Meta:
        proxy = True
        verbose_name = "Leaderboard"
        verbose_name_plural = "Leaderboard"
        ordering = ["-total_score"]
