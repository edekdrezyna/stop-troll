# stop-troll
Wtyczka chrome do oznaczania rosyjskiej propagandy. Główne założenia:
- Każdy użytkownik może oznaczyć dla siebie prywatnie dowolnego innego użytkownika
- Każdy użytkownik może podzielić się swoją listą - opierając się na społecznej kontroli list, gdzie użytkownicy sami uznają która lista jest wiarygodna a która nie, maleje zagrożenie oznaczania 'na ślepo' lub ludzi odmiennych światopoglądowo. To użytkownik decyduje kogo dodaje do listy i czyjej liście ufa na tyle aby jej użyć.
- Propaganda jest oznaczana - lecz nie usuwana. Warto wiedzieć jaki jest aktualny przekaz propagandowy i się na niego nie zamykać, przy jednoczesnej stygmatyzacji takich osób.
- Oznaczenia w przyszłości zostaną użyte do bardziej zmyślnych algorytmów które automatycznie będą rozpoznawały słowa kluczowe i flagowały propagandę ;)


# Aktualnie wspierane serwisy:
- wykop.pl
- Twitter
- Facebook
- Youtube

## In progress:
- Autodetektor treści

# Jak zainstalować?

Aktualnie wtyczka jest w trakcie aktywnego developmentu i nie jest dostępna do pobrania oficjalnie. Korzystasz z niej na własne ryzyko.
Uznałem, że najważniejsze jest aby jak najszybciej oddać ją do użytku ale oczywiście oficjalna dystrybucja powstanie na dniach jak tylko rozwiążemy najważniejsze problemy ;)

- Pobierz repozytorium - https://github.com/edekdrezyna/stop-troll/archive/refs/heads/main.zip
- Rozpakuj archiwum
- W pasku adresu przeglądarki wpisz chrome://extensions/
- Włącz developer-mode/tryb developera
- Kliknij load-unpacked/Załaduj rozpakowane
- Wybierz wypadkowane archiwum

# Jak używać? (wykop.pl)

## Jak zaraportować trolla?
- Kiedy wejdziesz na wykop.pl w dowolne znalezisko lub na wykop.pl/mikroblog przy loginach użytkowników pojawi się szary przycisk do oznaczania trolli
- Klikając przycisk, dodasz użytkownika do Twojej prywatnej listy trolli - przechowywanej w localStorage Twojej przeglądarki
- Klikając przycisk Troll, usuwasz użytkownika z listy.

## Jak poinformować innych?
Listy trolli są prywatne i są tylko i wyłącznie na Twoim komputerze, lecz istnieje możliwość - a wręcz zachęcam do niej, żeby podzielić się swoją listą trolli z innymi.
- W prawym górnym rogu twojej przeglądarki kliknij na puzzel (rozszerzenia)
- Na liście pojawi się rozszerzenie Stop Troll, kliknij obok niego trzykropek
- Wybierz Options
- Pojawi się ekran na którym możesz zarówno zaimportować jak i wyeksportować swoją listę. 

### Jak wyeksportować?
- Kliknij guzik 'Kliknij aby pobrać swoją listę'
- Zostanie pobrany plik z rozszerzeniem .json - żaden to .json, w środku jest lista zapisana zwykłym tekstem

### Jak zaimportować?
- W pole tekstowe przeklej zawartość wyeksportowanego pliku .json lub podaj nicki oddzielone przecinkami(bez spacji)
- Zatwierdź guzikiem 'OK'
- Twoja lista zostanie poszerzona o użytkowników z listy.