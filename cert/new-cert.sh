openssl req \
    -new \
    -newkey ec \
    -pkeyopt ec_paramgen_curve:prime256v1 \
    -days 365 \
    -nodes \
    -x509 \
    -subj "/C=LT/ST=Vilniaus m./L=Vilnius/O=VGTU/CN=localhost" \
    -keyout private.key \
    -out certificate.cert