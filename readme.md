This is a four part module that will allow for distributed web tests using PhantomJS and Nightmare.

Parts:

WebTests
These are javascript tests using Nightmare and PhantomJS. Results are reported back to the main server.

Node Software
This software runs the nodes (Raspberry Pi/VMWare) and downloads updates from the main host server. This software is what registers with the main server and runs the WebTests.

Server Software
This runs in Azure (or somewhere like it) and accepts reports from the WebTests. Data is then available via APIs for the dashboard. Updates to WebTests and Node Software are stored here and available for nodes to update themselves.

Dashboard
This shows a visual for data collected. A global showing the current health of the system along with a drill down option to get detailed information on any given request.