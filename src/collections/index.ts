import { Events } from './Events'
import { Media } from './Media'
import { Pages } from './Pages'
import { Partners } from './Partners'
import { Podcasts } from './Podcasts'
import { Posts } from './Posts'
import { Shows } from './Shows'
import { Staff } from './Staff'
import { Categories, EventTypes, Genres, PodcastFilters } from './taxonomies'
import { Users } from './Users'

export const collections = [
  // content
  Posts,
  Events,
  Podcasts,
  Shows,
  Staff,
  Partners,
  Pages,
  Media,
  // taxonomies
  Categories,
  EventTypes,
  PodcastFilters,
  Genres,
  // system
  Users,
]
