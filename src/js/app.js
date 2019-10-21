import page from 'page'
import {home} from './home.js'
import {campaign} from './campaign.js'
import {newCampaign} from './newCampaign.js'
import {pj} from './pj.js'
import {newPj} from './newPj.js'
import {master} from './master.js'
import {notfound} from './notfound.js'

page('/', home)
page('/campaign', notfound)
page('/campaign/new', newCampaign)
page('/campaign/:campaign/new', newPj)
page('/campaign/:campaign/master', master)
page('/campaign/:campaign/:pj', pj)
page('/campaign/:campaign', campaign)
page('/error/:error', home)
page('*', home)
page()
