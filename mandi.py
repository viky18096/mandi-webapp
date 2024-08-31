import asyncio
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes

async def open_webapp(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    print("Received /webapp command")  # Debug print
    await update.message.reply_text(
        "Open our Web App!",
        reply_markup=InlineKeyboardMarkup([
            [InlineKeyboardButton("Open", web_app=WebAppInfo("https://mandi.com"))]
        ])
    )

def main() -> None:
    print("Starting the bot...")  # Debug print
    application = Application.builder().token("7251897142:AAEJu9DAPk12ZTFYOE-Xj4l0P5WYWlPibJU").build()
    application.add_handler(CommandHandler("webapp", open_webapp))
    print("Bot is running. Press Ctrl+C to stop.")  # Debug print
    application.run_polling()

if __name__ == '__main__':
    main()