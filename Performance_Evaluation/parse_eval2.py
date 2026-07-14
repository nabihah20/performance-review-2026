import openpyxl
import pandas as pd
import json

def inspect_file(filepath):
    print(f"=== {filepath} ===")
    xls = pd.ExcelFile(filepath)
    for sheet_name in xls.sheet_names:
        print(f"Sheet name: {sheet_name}")
        df = pd.read_excel(filepath, sheet_name=sheet_name)
        print(df.head(10))
        print("-" * 50)

inspect_file(r"C:\Performance_Evaluation\Self_Performance_Evaluation_Form (nabihah) Jan-Jun 2026.xlsx")
inspect_file(r"C:\Performance_Evaluation\Weekly_Report_2026_nabihah_Updated.xlsx")
