export const convertOldBFR = () => {
  // Convert old BangForReddit.com localStorage into new one
  let oldBfrDecksJson: string | null;
  if (process['browser'] && (oldBfrDecksJson = localStorage.getItem('BRF-decks.decks'))) {
    const parsed = JSON.parse(oldBfrDecksJson);

    const newJson = {
      currentDeckId: parsed.currentDeckId,
      usingApollo: false,
      deckIds: parsed.ids,
      decks: parsed.entities
    };

    localStorage.setItem('bfr-decks', JSON.stringify(newJson));

    let i = -1;
    while (++i < parsed.ids.length) {
      const deckId = parsed.ids[i];
      const subredditSettings = parsed.entities[deckId].subredditSettings;
      const subredditIds = parsed.entities[deckId].subredditIds;

      let i2 = -1;
      while (++i2 < subredditIds.length) {
        const subredditId = subredditIds[i2];
        localStorage.setItem(
          `subreddit-${deckId}-${subredditId}`,
          subredditSettings[subredditId].type ? `"${subredditSettings[subredditId].type}"` : `"hot"`
        );
      }
    }

    localStorage.removeItem('BRF-decks.decks');
  }
};
