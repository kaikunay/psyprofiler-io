# tools/pdf_generator.py
from fpdf import FPDF
import json
import os
from loguru import logger
from datetime import datetime

class ReportPDF(FPDF):
    def header(self):
        # Military Aesthetic Header
        self.set_font('Courier', 'B', 15)
        self.set_text_color(200, 0, 0)
        self.cell(0, 10, '>> PSYPROFILER INTELLIGENCE DOSSIER <<', 0, 1, 'C')
        self.set_font('Courier', '', 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 5, f'CLASSIFICATION: CONFIDENTIAL | DATE: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}Z', 0, 1, 'C')
        self.line(10, 25, 200, 25)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Courier', 'I', 8)
        self.set_text_color(128)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')
        self.cell(0, 10, 'FOR AUTHORIZED EYES ONLY', 0, 0, 'R')

    def chapter_title(self, title):
        self.set_font('Courier', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.set_text_color(0, 0, 0)
        self.cell(0, 8, f' [ TARGET VECTOR: {title.upper()} ] ', 0, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Courier', '', 11)
        self.set_text_color(30, 30, 30)
        # Handle newlines properly
        self.multi_cell(0, 6, body)
        self.ln()

class Generator:
    @staticmethod
    def create_report(json_data: str, output_path: str) -> bool:
        """Parses the Synthesizer JSON output and creates a slick PDF."""
        try:
            data = json.loads(json_data)
            
            pdf = ReportPDF()
            pdf.set_auto_page_break(auto=True, margin=15)
            pdf.add_page()
            
            # Target Summary
            pdf.chapter_title("Primary Identification")
            summary = data.get("core_thesis", "No core thesis identified.")
            pdf.chapter_body(summary)
            
            # Risk & Vulnerabilities (Dark Triad context)
            if "risk_vectors" in data:
                pdf.chapter_title("Risk & Vulnerability Assessment")
                risk_text = "\n".join([f"- {v}" for v in data["risk_vectors"]])
                pdf.chapter_body(risk_text)
                
            # Behavioral Predictions 
            if "behavioral_predictions" in data:
                pdf.chapter_title("Behavioral Predictions (Stress/Baseline)")
                pred = data["behavioral_predictions"]
                pred_text = f"Baseline Operations: {pred.get('baseline_behavior', 'N/A')}\n"
                pred_text += f"Under Stress Matrix: {pred.get('stress_response', 'N/A')}"
                pdf.chapter_body(pred_text)
                
            # Tactical Playbooks
            if "playbooks" in data:
                pdf.chapter_title("Tactical Playbooks & Influence Vectors")
                books = data["playbooks"]
                for p_type, p_content in books.items():
                    pdf.set_font("Courier", "B", 10)
                    pdf.cell(0, 6, f"> {p_type.upper()} PROTOCOL", 0, 1)
                    pdf.set_font("Courier", "", 10)
                    
                    if "dos" in p_content and "donts" in p_content:
                        pdf.multi_cell(0, 5, f"DO:\n" + "\n".join([f"  + {d}" for d in p_content["dos"]]))
                        pdf.multi_cell(0, 5, f"AVOID:\n" + "\n".join([f"  - {d}" for d in p_content["donts"]]))
                    else:
                        # Fallback if structure is different
                        pdf.multi_cell(0, 5, str(p_content))
                    pdf.ln(2)

            pdf.output(output_path)
            logger.info(f"PDF generated successfully at {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to generate PDF: {e}")
            return False
