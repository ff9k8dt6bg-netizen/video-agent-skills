import asyncio, json, sys, edge_tts
async def main():
    text = open('texte.txt', encoding='utf-8').read().strip()
    import os; c = edge_tts.Communicate(text, 'fr-FR-HenriNeural', boundary='WordBoundary', proxy=os.environ.get('HTTPS_PROXY'))
    words = []
    with open('voix.mp3', 'wb') as f:
        async for ch in c.stream():
            if ch['type'] == 'audio': f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                words.append({'text': ch['text'], 'start': ch['offset'] / 1e7, 'end': (ch['offset'] + ch['duration']) / 1e7})
    json.dump(words, open('mots.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(words), 'mots, fin', words[-1]['end'] if words else None)
asyncio.run(main())
