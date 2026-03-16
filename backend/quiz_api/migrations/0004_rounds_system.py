from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz_api', '0003_remove_question_code_language_and_more'),
    ]

    operations = [
        # Add round fields to Student
        migrations.AddField(
            model_name='student',
            name='round1_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='student',
            name='round2_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='student',
            name='current_round',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='student',
            name='round1_completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='student',
            name='round2_qualified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='student',
            name='round2_completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='student',
            name='round1_start_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='student',
            name='round1_end_time',
            field=models.DateTimeField(blank=True, null=True),
        ),

        # Add round_number and points to Question
        migrations.AddField(
            model_name='question',
            name='round_number',
            field=models.IntegerField(
                choices=[(1, 'Round 1 - MCQ'), (2, 'Round 2 - Code Debugging')],
                default=1
            ),
        ),
        migrations.AddField(
            model_name='question',
            name='points',
            field=models.IntegerField(default=10),
        ),

        # Increase option field lengths
        migrations.AlterField(
            model_name='question',
            name='option_a',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='question',
            name='option_b',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='question',
            name='option_c',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='question',
            name='option_d',
            field=models.CharField(max_length=500),
        ),

        # Add round_number to StudentAnswer
        migrations.AddField(
            model_name='studentanswer',
            name='round_number',
            field=models.IntegerField(default=1),
        ),
    ]
