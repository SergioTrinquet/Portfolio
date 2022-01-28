## Portfolio
Mon portfolio réalisé avec la bibliothèque d'animation GSAP.

### Mise en production avec Vercel

Vercel permet de mettre en production un projet importé à partir de son compte github.    

A noter que j'utilise Gulp comme task manager pour générer des fichiers minifiés et bundlés.

Or le projet archivé sur github comprend les fichiers sources avant l'execution des tasks Gulp qui permettent  d'obtenir les fichiers finaux à mettre en ligne.  
Il me faut donc lors de cette mise en production, pouvoir builder mon projet en executant la commande "gulp", et dire à Vercel de mettre en ligne le répertoire de fichiers buildés seulement (répertoire "dist" dans ce projet et pas "src").  

Voici comment j'ai procédé :

1 - J'ajoute dans le fichier "package.json" dans la propriété "scripts" > "build" la valeur "gulp". C'est la commande écrite dans le fichier gulpfile.js qui va executer les tasks de build et générer le repertoire "dist" dans lequel on aura les fichiers à mettre en prod.

2 - Maintenant il faut que Vercel utilise cette commande "build" lors du déploiement. C'est ce qu'il fait lorsqu'il détecte un framework, mais ici, nous n'en avons pas utilisé.   
Nous devons donc dire explicitement à Vercel de le faire : Sur le site de Vercel, dans les settings du projet (menu "Settings > General > Build & Development Settings"), on signifie dans le champ de saisie quelle est la commande de build à executer lors de la mise en ligne : Ici donc "npm run build" qui déclenchera la commande "gulp". 

Enfin, toujours au même endoit dans les settings, on va aussi spécifier le répertoire à déployer (champ de saisie "Output directory"): Ici le répertoire "dist".  

NOTE: Dans les 2 cas, ne pas oublier de cocher l'option "override" à coté des champs de saisie

Et voilà!