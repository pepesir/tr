const tournamentService = require('./tournamentService')
const updateBracket = require('./bracket/bracket')
const reportMatchScore = require('./bracket/rounds/matches/matches')

const tournament = async function (fastify, options, next) {
  fastify.post('/', tournamentService.newTournament)
  fastify.get('/:tournamentId', tournamentService.getTournament)
  fastify.put('/:tournamentId/bracket', updateBracket)
  fastify.put('/:tournamentId/bracket/rounds/:roundId/matches/:matchId', reportMatchScore)
  next()
}

module.exports = tournament
