// Read-only access to the scaffolded Cognite Docs MCP when no native MCP tool is exposed.
const [mode = 'list', ...words] = process.argv.slice(2);
if (!['list', 'search', 'read'].includes(mode))
  throw new Error('Read-only docs methods only');
const method = mode === 'list' ? 'tools/list' : 'tools/call';
const params =
  mode === 'search'
    ? { name: 'search_cognite_docs', arguments: { query: words.join(' ') } }
    : mode === 'read'
      ? {
          name: 'query_docs_filesystem_cognite_docs',
          arguments: { command: words.join(' ') },
        }
      : {};
const response = await fetch('https://docs.cognite.com/mcp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
  },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  signal: AbortSignal.timeout(30000),
});
if (!response.ok) throw new Error(`Docs MCP: ${response.status}`);
const body = await response.text();
const data = body.split('\n').find((line) => line.startsWith('data: '));
const result = JSON.parse(data ? data.slice(6) : body);
console.log(
  result.result?.content?.map((item) => item.text ?? '').join('\n') ??
    JSON.stringify(result),
);
