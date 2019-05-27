import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography, Tabs, Tab, Box } from '@material-ui/core';

export default function TopBar({ activeDeck, activateDeck, deckIds, decks }) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box>
          <Typography noWrap variant="h6">
            Bang! for Reddit
          </Typography>
        </Box>
        <Box width="50%">
          <Tabs
            value={activeDeck.id}
            variant="scrollable"
            scrollButtons="on"
            onChange={(event, deckId) => activateDeck(deckId)}
          >
            {deckIds.map((deckId: string) => <Tab key={deckId} value={deckId} label={decks[deckId].name} />)}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
