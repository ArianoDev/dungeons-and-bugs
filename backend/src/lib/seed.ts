import { gameClasses, starterLeaderboard } from '../../../shared/gameContent.js'
import { GameClassModel } from '../models/GameClassModel.js'
import { LeaderboardEntryModel } from '../models/LeaderboardEntryModel.js'

export const seedDatabase = async () => {
  await Promise.all(
    gameClasses.map((gameClass) =>
      GameClassModel.updateOne({ id: gameClass.id }, { $set: gameClass }, { upsert: true }),
    ),
  )

  const leaderboardCount = await LeaderboardEntryModel.countDocuments({ mode: 'event' })
  if (leaderboardCount === 0) {
    await LeaderboardEntryModel.insertMany(
      starterLeaderboard.map(({ id, ...entry }) => ({
        ...entry,
        seedId: id,
        mode: 'event',
      })),
    )
  }
}
