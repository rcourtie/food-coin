import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

import firebase from 'firebase/app';
import 'firebase/firestore';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  header: { textAlign: 'center' },
  card: {
    padding: theme.spacing(1, 3),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
}));

const firebaseConfig = {
  apiKey: 'AIzaSyBsFYUtMxaVWuFaw2NJJP6hLMmxUJ-PkNs',
  authDomain: 'food-coin-c8ffc.firebaseapp.com',
  databaseURL: 'https://food-coin-c8ffc.firebaseio.com',
  projectId: 'food-coin-c8ffc',
  storageBucket: '',
  messagingSenderId: '87659836931',
  appId: '1:87659836931:web:730105f76e9e2eed',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const firestore = app.firestore();
const coinDb = firestore.collection('coin').doc('AVtwWIsTS7JZVsl2KvnY');

function App({ initialGirl }) {
  const classes = useStyles();
  const [girl, setGirl] = useState(initialGirl);

  useEffect(() => {
    const unsubscribe = coinDb.onSnapshot(doc => {
      const { girl } = doc.data();
      setGirl(girl);
    });

    return unsubscribe;
  });

  const handleClick = () => {
    firestore
      .runTransaction(transaction => {
        return transaction.get(coinDb).then(ref => {
          if (!ref.exists) {
            throw new Error('Document does not exists!');
          }
          transaction.update(coinDb, { girl: !girl });
        });
      })
      .catch(error => console.log('ah fuck', error));
  };

  if (girl === undefined) {
    return (
      <Container>
        <h1>loading…</h1>
      </Container>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} s={1}>
        <h2 className={classes.header}>Who gets to choose?</h2>
      </Grid>
      <Grid item xs={12} s={1} m={1} l={1}>
        <Paper className={classes.card}>
          <h1>{girl ? 'Girl' : 'Boy'}</h1>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleClick}
        >
          Use the token
        </Button>
      </Grid>
    </Grid>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
