FROM ubuntu:14.04

MAINTAINER Guy Irvine <guy@guyirvine.com>

RUN echo "Install packages" \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y update \
  && apt-get install -y \
      git \
      wget

RUN echo "Setup locales" \
  && localedef -c -i en_NZ -f UTF-8 en_NZ.UTF-8 \
  && update-locale LANG=en_NZ.UTF-8

RUN echo "Cleaning up" \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

ENV GO_VERSION 1.4.2

RUN echo 'Downloading go1.4.2.linux-amd64.tar.gz' \
  && wget -q https://storage.googleapis.com/golang/go1.4.2.linux-amd64.tar.gz \
  && echo 'Unpacking go language' \
  && tar -C /usr/local -xzf go1.4.2.linux-amd64.tar.gz

ENV GOPATH=/opt/project
ENV PATH=$PATH:/opt/project/bin:/usr/local/go/bin

COPY . /opt/project/

WORKDIR /opt/project/src/github.com/guyirvine/project

RUN go get \
  && go install

ENV DB "user=vagrant dbname=project password=vagrant host=172.17.42.1"

EXPOSE 5001

ENTRYPOINT ["project"]
