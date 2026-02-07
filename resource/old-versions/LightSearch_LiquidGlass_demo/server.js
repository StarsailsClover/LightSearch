// Simple mock server for the LightSearch demo
// Run with: node server.js
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
// attach static files at root (we'll copy index files into /public when serving locally)
app.get('/api/search', (req,res)=>{
  const q = req.query.q || 'query';
  const academic = req.query.academic === '1';
  const sources = [
    {source:'Web', delay:200, items:[{title:`${q} — Web result`, desc:'Short summary from the web', url:'#web1'}]},
    {source:'Bing', delay:420, items:[{title:`${q} — Bing-like result`, desc:'Bing style snippet', url:'#bing1'}]}
  ];
  if(academic) sources.push({source:'Academic', delay:900, items:[{title:`${q} — Paper (mock)`, desc:'Abstract snippet', url:'#paper1'}]});
  res.json({sources});
});
app.listen(port, ()=>console.log('LightSearch mock server running on http://localhost:'+port));
