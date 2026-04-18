# tools/email_sender.py
import os
import resend
from loguru import logger
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY", "")

class EmailService:
    @staticmethod
    def send_report(to_email: str, pdf_path: str, filename: str = "PsyProfiler_Intelligence_Report.pdf") -> bool:
        """Sends the generated PDF report via Resend."""
        if not resend.api_key:
            logger.error("RESEND_API_KEY not found. Cannot send email.")
            return False
            
        try:
            with open(pdf_path, "rb") as f:
                pdf_bytes = f.read()

            params: resend.Emails.SendParams = {
                "from": "PsyProfiler Intel <intel@psyprofiler.io>",  # Replace with verified domain later
                "to": [to_email],
                "subject": "CLASSIFIED: Your PsyProfiler Intelligence Dossier is Ready",
                "html": """
                <div style="font-family: monospace; color: #1a1a1a; padding: 20px;">
                    <h2 style="color: #d11;">[ CONFIDENTIAL ] INTEL DOSSIER ENCLOSED</h2>
                    <p>Operator,</p>
                    <p>The PsyProfiler Intelligence System has completed the psychological rendering of your target.</p>
                    <p>The attached dossier contains insights spanning Big Five OCEAN, Dark Triad, Archetype dynamics, and unconscious drivers.</p>
                    <p>Use this intelligence responsibly.</p>
                    <br/>
                    <p>— The AI Council</p>
                </div>
                """,
                "attachments": [
                    {
                        "filename": filename,
                        "content": list(pdf_bytes)
                    }
                ]
            }

            email = resend.Emails.send(params)
            logger.info(f"Report emailed successfully to {to_email}. ID: {email.get('id')}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False
