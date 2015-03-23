<h2>Service Runner</h2>
<p><code>app.js</code> is the file that is responsible for coordinating execution
of all the services. <code>basic-server.js</code> is the file that is responsible
for serving web pages. For this application to be fully functional 2 distinct node instances need to
be ran simultaneously. There needs to be a node process which runs the
web server. There also needs to be another node process which runs the
Github API key detection services. The key distinction here is that both
<code>app.js</code> and <code>basic-server.js</code> need to be ran
simultaneously for the application to be fully functional.</p>

<h2>Services</h2>
<ol>
  <li><b>Scrape</b> Git repository meta data</li>
  <li><b>Download</b> Git repositories based on meta data</li>
  <li><b>Parse</b> Git repository content to detect security flaws</li>
</ol>

<h3>Scraping</h3>
<p>The scraping service is responsible for downloading the most
recently updated Github repository <code>metadata</code> using Github API. It then persists those
repositories <code>metadata</code> to a MongoDB data store. After the scraping service is done downloading repository
<code>metadata</code> to MongoDb the downloading service takes over and downloads the
actual repositories associated with the <code>metadata</code> that the scraping service
acquired.</p>

<p>The current query for this API call is:
<pre>https://api.github.com/search/repositories?q=pushed:>=' + dateString +
'&order=desc&per_page=100</pre>

<h3>Downloading</h3>
<p>The downloading service is responsible for downloading github repositories
whose <code>metadata</code> was retrieved by the scraping service. The downloading service pulls information
from the <code>metadata</code> MongoDb collection. Once downloading service has
the <code>metadata</code> collection, it gets the <code>git_url</code> property
from each instance of <code>metadata</code>. It then uses the
<a href="https://github.com/nodegit/nodegit">nodegit</a> module to download the contents of the <code>git_url</code>
from Github. Downloaded repositories are stored in the <code>git_data</code>
directory. After the downloading service is finished downloading repositories to
the <code>git_data</code> directory the parsing service becomes activated and
API key detection begins.</p>

 <h3>Parsing</h3>
<p>The parsing service initiates after the downloading service finishes
acquiring repositories. When this occurs the parsing service pulls repositories
from the database and uses bash and regex to scan for API keys. </p>

<p>As repositories are downloaded to the database they are attributed a <code>processed</code>
property which is initialized to <code>false</code>. Once the parsing service
pulls out a repository from the database, it immediately marks its
<code>processed</code> property to <code>true</code>. This makes it so the
parsing service will never process duplicate instances of any single
document.</p>

<p>If the parsing service detects an API key it registers the violation in the
<code>hitdata</code> MongoDb collection. Once all repositories are scanned
garbage collection occurs via the <code>fileSystem</code> subservice and then
the entire cycle of scraping, downloading, and parsing is recursively restarted.</p>


<h3>Database</h3>
<p>Rather than each service creating it's own database connection, each service
shares a single connection. This single connection is established in
<code>app.js</code> and is accessible to all services via <code>GLOBAL.db</code></p>

<p>Currently, the services are architectured in such a way whereby MongoDB is the first thing to be initialized.
All services are being passed into MongoDb's connection callback function.
Basing our service architecture around callbacks is not ideal, but it is stable
for our current data load and necessary to reach MVP.</p>

<p>Ideally, services would use <a
href="https://nodejs.org/api/events.html">EventEmitters</a> instead of callbacks
as a means of communicating with each other asynchronously.
Using EventEmitters instead of callbacks would decouple services and allow for much greater code flexibility.
Until MVP is reached however, the current service architecture will be
utilized.</p>

<h3>Tools</h3>
<p>The downloading and parsing services use the <code>async</code> module in
order to use an asynchronous <code>for</code> loop to retrieve the
<code>metadata</code> from MongoDb.</p>

<h3>Required Documentation</h3>
<ol>
  <li>Add section for outcome and purpose of application as a whole</li>
  <li>Add section for backend</li>
  <li>Add section for frontend</li>
</ol>
