# tools/osint_tool.py
import asyncio
from playwright.async_api import async_playwright
import json
from loguru import logger

class OSINTGatherer:
    """Consent-first behavioral data harvesting tool."""
    
    # Define selectors for platforms to scrape bio/posts 
    SELECTORS = {
        "twitter": {"bio": '[data-testid="UserDescription"]', "posts": '[data-testid="tweetText"]'},
        "github": {"bio": '.p-note.user-profile-bio', "repos": '.repo'}
    }

    async def gather_intel(self, handles: dict) -> dict:
        """
        Takes a dict of {platform: handle} and gathers public footprint.
        handles expected format: {"twitter": "username", "github": "username"}
        """
        footprint_data = {"raw_bios": [], "themes": []}
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            
            for platform, handle in handles.items():
                if not handle or platform not in self.SELECTORS:
                    continue
                    
                logger.info(f"OSINT: Harvesting {platform} for {handle}")
                page = await context.new_page()
                
                try:
                    url_map = {
                        "twitter": f"https://x.com/{handle}",
                        "github": f"https://github.com/{handle}"
                    }
                    
                    await page.goto(url_map[platform], timeout=15000)
                    await page.wait_for_timeout(2000) # Give it a second to render
                    
                    # Extract Bio
                    bio_selector = self.SELECTORS[platform]["bio"]
                    bio_element = await page.query_selector(bio_selector)
                    if bio_element:
                        bio_text = await bio_element.inner_text()
                        footprint_data["raw_bios"].append(f"[{platform}] {bio_text}")
                        
                    # Extract recent text/themes (naive extraction for MVP)
                    if platform == "twitter":
                        posts = await page.query_selector_all(self.SELECTORS["twitter"]["posts"])
                        texts = [await p.inner_text() for p in posts[:5]] # max 5 for speed
                        footprint_data["themes"].extend(texts)
                        
                except Exception as e:
                    logger.warning(f"OSINT failed for {platform}: {str(e)}")
                finally:
                    await page.close()
                    
            await browser.close()
            
        return footprint_data

# For manual testing
if __name__ == "__main__":
    tester = OSINTGatherer()
    # async run requires asyncio block
    data = asyncio.run(tester.gather_intel({"github": "torvalds"}))
    print(json.dumps(data, indent=2))
