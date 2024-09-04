# main.py (your existing bot code)
import os
import asyncio
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

# Bot token
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

async def open_webapp(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    print("Received /webapp command")  # Debug print
    await update.message.reply_text(
        "Open our Web App!",
        reply_markup=InlineKeyboardMarkup([
            [InlineKeyboardButton("Open", web_app=WebAppInfo("https://viky18096.github.io/mandi-webapp/"))]
        ])
    )

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text("Hello! I'm your Mandi Bot. Use /webapp to open our web application.")

def main() -> None:
    # Create the Application and pass it your bot's token
    application = Application.builder().token(TOKEN).build()

    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("webapp", open_webapp))

    # Start the Bot
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()


