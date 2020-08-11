let editor = ace.edit('editor');
editor.setTheme('ace/theme/twilight');
editor.session.setMode('ace/mode/javascript');

// TODO: get the data from the actual server...
let _fileTree = [ {id: "root", text: "actual root", type: "root", icon: "fas fa-hdd"} ];
let _lastActivatedNode;

function ProcessFolderRequest(res, stat, http){
	if( res.nodePath.length === 1 ) {
		// first lets find out who the parent is
		// then append the children to it
		_fileTree[0].children = res.folderContents.map( elem => {
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
	}
	else {
		FindNodeToAppendTo( _fileTree[0], res.nodePath, res.folderContents, 0 );
		$.jstree.reference("filetree").refresh();

	}
}


function FindNodeToAppendTo( branch, targetPath, dataToAppend, depth ) {
	depth++;
	// if we have reached our leaf node, append the data
	if( depth !== targetPath.length ) {
		console.log("Trying to append to a LEAF node!");
		branch.children.forEach( elem => {
			if( elem.type === "file" )
				return;
			if(elem.name === targetPath[depth]){
				if( elem.children === undefined ){ // if we have reached our leaf-node
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


// OUT GENERATED, IS FUNCTIONAL BUT GRAPHICS SUX
$('#filetree').jstree({
	"core" : {
	  "animation" : 0,
	  //"check_callback" : true,
	  "themes" : { "stripes" : true, "dots": true },
	  //"themes" : { "variant" : "large" },
	  'data' : PopulateTree
	},
	"types" : {
	  "#" : {
		// "max_children" : 1,
		// "max_depth" : 4,
		"icon" : "fas fa-hdd",
		"valid_children" : ["root"]
	  },
	  "root" : {
		"icon" : "fas fa-hdd",
		"valid_children" : ["default", "file", "folder"]
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
		console.log("loaded? (maybe not get the same content twice)", base.node.original.loaded);
		if( base.node.original.loaded ){
			$.jstree.reference("filetree").toggle_node(base.node.id);
		}
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