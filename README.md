# EU Webseite
Das ist das Repository für den Kurs 4-3131-TIT19B, Arbeitsgruppe B5 

## Seite über Docker starten

Um die Seite über Docker starten, reicht es, `docker-compose up` einzugeben.
Daraufhin wird das Projekt vom *main*-Branch des Repositorys gestartet.

Soll das Projekt aus den lokalen Dateien gestartet werden, muss eine Datei mit dem Namen `.env` mit folgendem
Inhalt angelegt werden:
```
REPOSITORY=local

```

Der Variable *REPOSITORY* kann zu `git` geändert werden, um das Projekt wieder aus dem Git-Repository zu laden.
