FROM pagespeed/nginx-pagespeed:latest

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/cache/nginx/pagespeed
RUN chown nginx:root /var/cache/nginx/pagespeed
RUN chmod 700 /var/cache/nginx/pagespeed
RUN mkdir -p /var/log/pagespeed
RUN chown nginx. /var/log/pagespeed
