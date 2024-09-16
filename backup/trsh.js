export default{
	execute: async function(args, terminal){
		terminal.printLine('Reset everything');
		localStorage.clear();
	}
}
