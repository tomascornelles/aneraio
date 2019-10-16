import page from 'page'
import {home} from './home.js'
import {campaign, newCampaign} from './campaign.js'
import {pj, newPj} from './pj.js'
import {notfound} from './notfound.js'

page('/', home)
page('/campaign', notfound)
page('/campaign/new', newCampaign)
page('/campaign/:campaign', campaign)
page('/campaign/:campaign/new', newPj)
page('/campaign/:campaign/:pj', pj)
page('/error/:error', home)
page('*', home)
page()
