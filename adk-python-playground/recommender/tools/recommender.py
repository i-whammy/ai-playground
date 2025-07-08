import json
import os
from typing import Dict, List, Any
import re


def load_books_data() -> List[Dict[str, Any]]:
    """Load books data from books.json file."""
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        books_file = os.path.join(current_dir, "books.json")
        
        with open(books_file, 'r', encoding='utf-8') as f:
            books_data = json.load(f)
        
        return books_data
    except Exception as e:
        return []


def recommend(query: str) -> Dict[str, Any]:
    """
    ユーザーからの質問に対して、おすすめの文学作品の情報を提供します。
    Args:
        query: ユーザーからの質問
    Returns:
        Dict containing success status and results or error message
    """
    try:
        # Check if query is empty
        if not query.strip():
            return {
                "status": "failure",
                "message": "検索クエリが空です。"
            }
        
        # Load books data
        books = load_books_data()
        
        if not books:
            return {
                "status": "failure", 
                "message": "書籍データの読み込みに失敗しました。"
            }

        keywords = extract_japanese_keywords(query)
        print(keywords)

        books_result = [
            {
                "title": book["title"],
                "id": book["id"],
            }
            for book in books
            if any(keyword in book.get("content", "") for keyword in keywords)
        ]
        
        return {
            "status": "success",
            "books": books_result
        }
        
    except Exception as e:
        return {
            "status": "failure",
            "message": f"検索中にエラーが発生しました: {str(e)}"
        }


def extract_japanese_keywords(query: str) -> list:
    """
    「」で囲まれた文字列を検索用の文字列としてすべて抽出する
    """
    return re.findall(r'「(.*?)」', query)