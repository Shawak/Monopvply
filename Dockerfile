FROM nginx:1.11.10

RUN mkdir /usr/share/nginx/monopvply

RUN rm /etc/nginx/conf.d/default.conf
RUN echo '\n\
server {\n\
    listen      80;\n\
    server_name localhost;\n\
\n\
    location / {\n\
        root    /usr/share/nginx/monopvply/app;\n\
        index   index.html;\n\
    }\n\
}'\
>> /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443