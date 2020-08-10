let editor = ace.edit('editor');
editor.setTheme('ace/theme/twilight');
editor.session.setMode('ace/mode/javascript');

// TODO: get the data from the actual server...
let _fileTree = [ {id: "root", text: "actual root", type: "root", icon: "fas fa-hdd"} ];
let _lastActivatedNode;

function ProcessFolderRequest(res, stat, http){
	console.log("Success! : \n"+JSON.stringify(res));

	if( res.nodePath.length === 1 ) {
		// first lets find out who the parent is

		// then append the children to it
		_fileTree[0].children = res.folderContents.map( elem => {
			//console.log("is it a folder? "+elem.isFolder);
			//console.log(typeof(elem.isFolder));
			//console.log("but how?..." + (elem.isFolder == "true" ? "folder" : "file"));
			let retobj = {
				id: "root/"+elem.name,
				type: (elem.isFolder == "true" ? "folder" : "file"),
				name: elem.name,
				text: elem.name
			};
			return retobj;
		});
		_fileTree[0].loaded = true;

		$.jstree.reference("filetree").refresh();
		// setTimeout( () => {
		// 	$.jstree.reference("filetree").open_node("root");
		// }, 500 );
	}
	else {
		console.log("This aint the rootnode we're filling up here..");
		FindNodeToAppendTo( _fileTree[0], res.nodePath, res.folderContents, 0 );
		$.jstree.reference("filetree").refresh();
		// setTimeout( () => {
		// 	let nodeToOpen = res.nodePath.reduce( (a, c) => { return a+"/"+c; })
		// 	console.log("res.nodePath != ID", nodeToOpen);
		// 	$.jstree.reference("filetree").open_node(nodeToOpen);
		// }, 500 );

	}
	// update our tree to reflect any changes
}


function FindNodeToAppendTo( branch, targetPath, dataToAppend, depth ) {
	depth++;
	// if we have reached our leaf node, append the data
	if( depth === targetPath.length ){
		// if we've reached the final branch-node
		console.log("Final branch node!");
		branch.children.forEach( elem => {
			if(elem.name === targetPath[depth]){
				console.log("if we're ever getting here... FIX YER SHIT");
				elem.children = dataToAppend.map( elem => {
					let retobj = {
						id: targetPath.reduce( (a, c) => { return a+c; }),
						type: (elem.isFolder == "true" ? "folder" : "file"),
						name: elem.name,
						text: elem.name
					};
					return retobj;
				});
				elem.loaded = true;
				//$.jstree.reference("filetree").open_node(elem.id);
			}
		});
	}
	// if we haven't, continue diving deeper until we have found our target node
	else {
		branch.children.forEach( elem => {
			if( elem.type === "file" )
				return;
			//console.log("elem: ", elem);
			//console.log("targetPath[depth]: ", targetPath[depth]);
			if(elem.name === targetPath[depth]){
				console.log("We must go deeper... or not...");
				if( elem.children === undefined ){ // if we have reached our leaf-node
					console.log("no children???");
					elem.children = dataToAppend.map( elem => {
						let retobj = {
							id: targetPath.reduce( (a, c) => { return a+"/"+c; }) + "/" + elem.name,
							type: (elem.isFolder == "true" ? "folder" : "file"),
							name: elem.name,
							text: elem.name
						};
						return retobj;
					});
					elem.loaded = true;
				}
				else {
					console.log("WE DO HAVE CHILDREN");
					FindNodeToAppendTo( elem, targetPath, dataToAppend, depth );
				}
			}
		});
	}
}

function ReadFolder( requestPath ){
	console.log("requestpath ",requestPath);
	$.ajax({
		url: '/api/folder',
		type: 'POST',
		data: { folderpath: requestPath },
		success: ProcessFolderRequest
	});
}

function PopulateTree(obj, cb) {
	if(_fileTree.length === 0)
		return;
	cb.call(this, _fileTree);
}

$('#filetree').jstree({
	"core" : {
	  "animation" : 0,
	  //"check_callback" : true,
	  "themes" : { "stripes" : true },
	  'data' : PopulateTree
	},
	"types" : {
	  "#" : {
		"max_children" : 1,
		"max_depth" : 4,
		"valid_children" : ["root"]
	  },
	  "root" : {
		"icon" : "fas fa-hdd",
		"valid_children" : ["default"]
	  },
	  "default" : {
		"icon": "fas fa-times-circle",
		"valid_children" : ["default","file", "folder"]
	  },
	  "file" : {
		"icon" : "fas fa-file",
		"valid_children" : []
	  },
	  "folder" : {
		"icon" : "fas fa-folder-open",
		"valid_children" : ["default","file", "folder"]
	  }
	},
	"plugins" : [
	  "contextmenu", "dnd", "search",
	  "state", "types", "wholerow"
	]
});

$('#filetree').on('activate_node.jstree', (e, base) =>{
	// save this for use in the refres event
	_lastActivatedNode = base.node.id;

	// only try to get folder contents if we've clicked on a folder Node.
	if(base.node.type === "folder" || base.node.type === "root") {
		// TODO: check to see if the folder was already loaded; then simply close or open the node
		console.log("loaded? ", base.node.loaded);
		if( base.node.loaded )
			$.jstree.reference("filetree").toggle_node(base.node.id);
		else
			ReadFolder( base.node.id.split('/') );
	}
	else if(base.node.type === "file") {
		// TODO: load the file contents into Ace
	}
});

$('#filetree').on('refresh.jstree', () => {
	$.jstree.reference("filetree").open_node(_lastActivatedNode);
});

// Start off by building the first layer of our filetree
setTimeout( () => {
	$.jstree.reference("filetree").activate_node("root");
}, 500 );