
var nb_cases = 4, //nombre de cases pour les pions du mastermind
	attempts = 0, //nb tentatives
	nb_attemps_max = 20; //nb tentatives maximums

var possibilities = ['red', 'yellow', 'green', 'blue', 'orange', 'white', 'violet', 'fuchsia'], //choix couleurs posssibles
	nb_possibilities = possibilities.length; //nombre de choix

var	choix_utilisateur = [], //combinaison en cours du joueur
	solution = [], //combinaison de l'ordi
	plateau_jeu = [];  //ensemble des combinaisons déjà choisies

var display_solution = false;
var txt_notif;

$(function(){
	/********************
	initialisation du plateau de jeu
	********************/
	txt_notif = $("#txt_notif");

		//initialisation interface des choix possibles
		var	li_pions;
		for(var i=0; i<nb_possibilities; i++){

			$("ul.poss").append("<li class=coul"+i+">");
			$("li.coul"+i).css("background-color", possibilities[i])
				.data("coul", possibilities[i]).data("num_couleur", i)
				.on("click", clic_ajout_couleur);
			/*li_pions = $(".coul"+i);
			li_pions.style.background = possibilities[i];
			li_pions.onclick = clic_ajout_couleur;*/
		}

		//init comportement boutons
		$("#validate").on("click", validerCombi);
		$("#delete").on("click", supprCombi);
		$("#restart").on("click", function(){
			if(confirm("Voulez-vous vraiment recommencer la partie ?")){//fenetre de demande de réinitialisation du jeu
				location.reload(true);
			}
		});
		////////////////////////
		//init plateau de jeu///
		////////////////////////
			$("div.solution").append("<ul class='pions'>")
				.append("<button id='display'>Afficher / masquer la solution</button>");
			
			var pions_solution = $(".solution > ul");
			$("#display").on("click", function(){
				display_solution = !display_solution; //on inverse la var permettant l'affichage ou non de la solution
				pions_solution.css("display", display_solution ? "inline-block":"none");
				/*var pions_solution = document.getElementsByClassName("solution")[0].getElementsByTagName("ul")[0];
				pions_solution.style.display = display_solution ? "inline-block":"none"; //on affiche les pions de la soluce ou non*/
			});
			//init affichage cases pions ordi

			/*
			var ul = document.createElement("ul");
			ul.className = "pions";
			li_pions.appendChild(ul);
			*/
			for(var j=0; j<nb_cases; j++){//creation des 4 cases pour la tentative en cours
				pions_solution.append("<li>");
			}
			pions_solution.css("display", display_solution ? "inline-block":"none");

			/*var button_display = document.createElement("button");
			button_display.textContent = "Afficher / masquer la solution";
			button_display.id = "display";
			button_display.onclick = function(){
				var pions_solution = document.getElementsByClassName("solution")[0].getElementsByTagName("ul")[0];
				display_solution = !display_solution; //on inverse la var permettant l'affichage ou non de la solution
				pions_solution.style.display = display_solution ? "inline-block":"none"; //on affiche les pions de la soluce ou non
			}
			li_pions.appendChild(button_display);*/

			//$("div.solution").append(li_pions);
//alert("0");
			//init affichage cases normales
			
			//var plateau = document.getElementsByClassName("plateau")[0];
			for(var i=0; i<nb_attemps_max; i++){
				/*var li_pions = document.createElement("li"); //li_pions = série de cases d'1 manche
				li_pions.className = "attempt"+i;*/
				$(".plateau").append("<li class='attempt"+i+"'>");
				var li_pions = $(".attempt"+i);
				/*var txt = document.createElement("p");
				txt.textContent = (i+1)+" : ";
				li_pions.appendChild(txt);*/
				li_pions.append("<p>"+(i+1)+"</p>");

				/*var ul = document.createElement("ul");
				ul.className = "pions";
				li_pions.appendChild(ul);*/
				li_pions.append("<ul class='pions'>");
				var ul = $("ul", li_pions);
				for(var j=0; j<nb_cases; j++){//creation des 4 cases pour la tentative en cours
					/*var li = document.createElement("li");
					ul.appendChild(li);*/
					ul.append("<li>");
				}

				/*var span1 = document.createElement("span");
				span1.className = "pion_bon";
				li_pions.appendChild(span1);*/
				li_pions.append("<span class='pion_bon'>");

				/*var span2 = document.createElement("span");
				span2.className = "pion_mal";
				li_pions.appendChild(span2);*/
				li_pions.append("<span class='pion_mal'>");

				//plateau.appendChild(li_pions);
			}
		///////////////////////////////////////////////////////////////////////////////////////////
		//tirage au sort par l'ordi de couleurs
		choixOrdi();
		affichagePionsOrdi(); //c'est pas drole sinon :D

	});
	
	/********************
	tirage au sort d'une combinaisons de pions par l'ordinateur
	********************/
	function choixOrdi(){
		solution = [];
		var choix_restants = [];
		var nb_possibilities = possibilities.length;
		for(var i=0; i<nb_possibilities; i++){
			choix_restants.push(i);
		}
		for(var i=0; i<nb_cases; i++){
			//choix d'une valeur de case
			nb_possibilities = choix_restants.length;
			console.log("nbPoss:"+nb_possibilities);
			var val = Math.floor(Math.random()*nb_possibilities); //on choisit une val aléatoire dans les choix restants
			solution.push(choix_restants[val]);
			choix_restants.splice(val,1);
			console.log(i+": val="+val+", choix")
		}
		//return solution; //la var solution est globale
	}

	function affichagePionsOrdi(){
		//affichage du choix de l'ordi :D
		var num_couleur, cases_ordi = $(".solution li").each(function(i) {
			num_couleur = solution[i];
			$(this).css('background-color', possibilities[num_couleur]);
		});

		/*for(var i=0; i<nb_cases; i++){
			num_couleur = solution[i];
			cases_ordi[i].style.backgroundColor = possibilities[num_couleur];
		}*/
	}

	/**************
	*comportement lors du clic pour ajouter couleur sur plateau
	**************/
	function clic_ajout_couleur(){
		if(choix_utilisateur.length<nb_cases){
			num_couleur = $(this).data("num_couleur");
			coul = $(this).data("coul");
			var num_case = Math.min(nb_cases-1, choix_utilisateur.length); //nb_cases -1 car la couleur n'a pas été encore choisie
			
			/*var case_en_cours = document.getElementsByClassName("attempt"+attempts)[0].getElementsByTagName("ul")[0].getElementsByTagName("li");
			case_en_cours[num_case].style.backgroundColor = e.target.style.backgroundColor; //on donne la couleur de fond choisie à la case*/
			
			nb = $(".attempt"+attempts+" ul>li:nth-child("+(num_case+1)+")").css("background-color", coul).html();
			//alert("numCoul:"+num_couleur+", num_case:"+num_case+", cases:"+nb);

			choix_utilisateur.push(num_couleur);
		} else {
			txt_notif.text("Veuillez effacer la combinaison du plateau pour pouvoir ajouter une couleur !");
		}
	}

	/**************
	*comportement pour valider combi couleur du plateau
	**************/
	function validerCombi(){
		if(choix_utilisateur.length<nb_cases){
			txt_notif.text("Vous n'avez pas choisi tous les pions, validation impossible !");
			return;
		}
		var tabRes = verification(choix_utilisateur, solution);
		affichageRes(tabRes);
		attempts++; //une tentative de + (sachant qu'on part de 0)
		choix_utilisateur = [];
		txt_notif.text("bien_place="+tabRes["bien_place"]+"/"+nb_cases);
		if(tabRes["bien_place"] == nb_cases){
			alert("Bien joué, vous êtes un vrai dieu (il ne vous a fallu que " + attempts +" tentative" + (attempts>1 ? "s":"") + " pour trouver la solution, quel talent) !");
			location.reload(true);
		} else if(attempts>=nb_attemps_max) {
			alert("Comme c'est dommage, vous avez perdu !");
			location.reload(true);
		}
	}

	/**************
	*comportement pour effacer combinaison du plateau
	**************/
	function supprCombi(){
		choix_utilisateur = [];
		/*cases_tentative = document.getElementsByClassName("attempt"+attempts)[0].getElementsByTagName("ul")[0].getElementsByTagName("li"); //on sélectionne la série de cases de la manche en cours
		for(var i=0; i<nb_cases; i++){
			cases_tentative[i].style.backgroundColor = "transparent";
		}*/
		$(".attempt"+attempts+" li").css("background-color", "transparent");

	}

	/**********************
	fonction calculant le nombre de cases bien et mal placées
	**********************/
	function verification(user_choices, solution){
		var tabRes = [];

		tabRes['bien_place'] = 0;
		tabRes['mal_place'] = 0;
		for(var i=0; i<user_choices.length; i++){
			//debugger;
			if(user_choices[i]==solution[i]){//case bien placée
				tabRes['bien_place']++;
			} else if(solution.indexOf(user_choices[i])!=-1) { //case pas a la bonne place
				tabRes['mal_place']++;
			}
		}
		return tabRes;
	}


	/*********************
	affichage des résultats
	*********************/
	function affichageRes(tabRes){
		var tentatives = document.getElementsByClassName("attempt"+attempts);
		var spans = tentatives[0].getElementsByTagName('span');
		spans[0].textContent = tabRes['bien_place'];
		spans[1].textContent = tabRes['mal_place'];
		spans[1].style.display = spans[0].style.display = "inline";
	}
