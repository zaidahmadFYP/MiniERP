import React from 'react';
import Grid from '@mui/material/Grid';
import Tile from '../Tilecomponent/TileComponent';

const TilesGrid = ({ tiles, onTileClick }) => {
  return (
    <Grid container spacing={2}>
      {tiles.map((tile) => (
        <Grid item xs={3} key={tile.name}>
          <Tile name={tile.name} image={tile.image} onClick={onTileClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TilesGrid;
