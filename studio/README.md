# HarperDB Studio
HarperDB Studio is a web based UI for managing users, roles, and your schema.
The HarperDB Studio also enables you to run NoSQL & SQL queries, create charts, save your favorite queries & charts and share them via live links to your organization.

Prior to downloading and installing HarperDB Studio you will need an install of HarperDB.
Visit [http://products.harperdb.io](http://products.harperdb.io) for download and install instructions of HarperDB if you do not have an instance of HarperDB.

## Setup
We recommend installing Node v8.11 or higher.

By default, HarperDB Studio runs on port 8080, and assumes you will be connecting to an instance of HarperDB with host localhost on port 9925.
To change any of these settings edit the file /config/config.json. A sample config.json looks like:

```json
{
   "default_host":"localhost",
   "default_port":9925,
   "http_port":8080
 }
 ```

 * default_host - Default host used to connect to HarperDB on the login screen
 * default_port - Default port used to connect to HarperDB on the login screen
 * http_port - Port that HarperDB studio will run on
 
 To add the package dependencies execute the command `npm install`

## Run
Launching the HarperDB studio is easy execute the command `node hdb_studio.js`
