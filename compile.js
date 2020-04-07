const path = require('path') //builds a directory path from the file in to Inbox.sol file. Cross-platform compatibility
const fs = require('fs') // file system module
const solc = require('solc')

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol')
/* __dirname - constant defined by node. takes you from route directory to Lottery.sol
 */

const source = fs.readFileSync(lotteryPath, 'utf8')
/* reading raw source code from contract. 
 pass in inboxPath 
 utf8 - type of encoding
*/

module.exports = solc.compile(source, 1).contracts[':Lottery']
// pass in source code, and specify the number of difference contracts we are compiling (here its 1)
