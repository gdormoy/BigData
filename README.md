# BigData

## La récupération des tweets
Pour la récupération des tweets vous devez suivres les étapes suivantes dans l'ordre:
1. Récupérer les scripts `config.js` et `getData.js`.
2. Editer le fichier `config.js` avec vos valeurs.
  ```js
  var config = {
    consumer_key:         '<ConsumerKey>',
    consumer_secret:      '<ConsumerSecret>',
    access_token:         '<AccessToken>',
    access_token_secret:  '<AccessTokenSecret>'
  }

  ```
3. Déposer les sur le edge node qui va servir à lancer le script:
  ```shell
  scp <chemin vers le fichier> <adresse du edge node>:~/
  ```
4. Installer NodeJS en version `8.9.4` sur l'edge node:
    ```shell
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
    nvm install node
    nvm install 8.9.4
    nvm use 8.9.4
    ```
5. Installer la librairie `twit` avec la commande `npm install twit`:
  ```bash
  npm install twit
  ```
6. Lancer le script NodeJS en arrière plan pour commencer à récupérer les tweets:
  ```shell
  nohup node getData.js 2> /dev/null &
  ```

## Envoi des tweets vers HDFS
L'envoi des tweets dans HDFS se fait via un script bash qui va renommer les fichiers contenant les tweets en ajoutant un timestamp dans le nom du fichier avant de l'envoyer, ensuite il sera executé régulièrement grace à un `cron`, son installation se fait via les étapes suivantes:
1. Récupérer le script `send_file.sh`
2. Déposer le script sur le même edge node que les scripts NodeJS
  ```shell
  scp <chemin vers le fichier> <adresse du edge node>:~/
  ```
3. Rendez le script executable:
  ```shell
  chmod +x send_file.sh
  ```
4. créer la regle cron:
  + Executer la commande suivantes pour éditer les regles cron
  ```shell
  crontab -e
  ```
  + Une fois dans l'éditeur insérez la regles suivantes:
  ```
    */10 * * * * /bin/sh /home/bessa/send_file.sh
  ```
  Cette règle va permettre d'executer le script toutes les 10 minutes et donc de pouvoir envoyer les tweets vers HDFS régulièrement.

## Spark
Pour spark il faut d'abord compiler le code `Scala` puis déplacer le `jar` dans le edge-NodeJS
Ensuite il faut déplacer le script `run_script.sh` dans le edge-node puis créer la variable d'environnement `LAST_TIMESTAMP` et la set a "0"
Enfin il faut lancer le script via la commande suivante:
```shell
source run_spark.sh
```
