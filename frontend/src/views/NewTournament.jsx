import React from 'react'
import { Container, Typography, Card, makeStyles } from '@material-ui/core'
import NewTournamentForm from '../components/NewTournament/'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '5rem',
    textAlign: 'center'
  },
  card: {
    padding: '2rem'
  }
}))

export default function NewTournament () {
  const classes = useStyles()

  return (
    <Container maxWidth='md' className={classes.root}>
      <Card variant='outlined' className={classes.card}>
        <Typography variant='h2'>
          NEW TOURNAMENT
        </Typography>
        <Typography variant='h6'>
          Fill out the form and start your tournament!
        </Typography>
        <NewTournamentForm />
      </Card>
    </Container>
  )
}