FROM node:18 as build

WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file del progetto
COPY . .

# Costruisci l'app Angular
RUN npm run build

# Usa un'immagine Nginx per servire l'app Angular
FROM nginx:alpine

# Copia i file costruiti dall'immagine precedente
COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html

# Copia il file di configurazione Nginx
COPY nginx.conf /etc/nginx/nginx.conf
