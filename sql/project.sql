--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: backlog_seq; Type: SEQUENCE; Schema: public; Owner: girvine
--

CREATE SEQUENCE backlog_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.backlog_seq OWNER TO girvine;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: backlog_tbl; Type: TABLE; Schema: public; Owner: girvine; Tablespace: 
--

CREATE TABLE backlog_tbl (
    id bigint DEFAULT nextval('backlog_seq'::regclass) NOT NULL,
    project_id bigint NOT NULL,
    name character varying NOT NULL,
    description character varying
);


ALTER TABLE public.backlog_tbl OWNER TO girvine;

--
-- Name: hypothesis_seq; Type: SEQUENCE; Schema: public; Owner: projectuser
--

CREATE SEQUENCE hypothesis_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hypothesis_seq OWNER TO projectuser;

--
-- Name: hypothesis_tbl; Type: TABLE; Schema: public; Owner: projectuser; Tablespace: 
--

CREATE TABLE hypothesis_tbl (
    id bigint DEFAULT nextval('hypothesis_seq'::regclass) NOT NULL,
    project_id bigint NOT NULL,
    persona_id bigint NOT NULL,
    outcome_id bigint NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public.hypothesis_tbl OWNER TO projectuser;

--
-- Name: outcome_seq; Type: SEQUENCE; Schema: public; Owner: projectuser
--

CREATE SEQUENCE outcome_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.outcome_seq OWNER TO projectuser;

--
-- Name: outcome_tbl; Type: TABLE; Schema: public; Owner: projectuser; Tablespace: 
--

CREATE TABLE outcome_tbl (
    id bigint DEFAULT nextval('outcome_seq'::regclass) NOT NULL,
    project_id bigint NOT NULL,
    name character varying NOT NULL,
    description character varying
);


ALTER TABLE public.outcome_tbl OWNER TO projectuser;

--
-- Name: persona_seq; Type: SEQUENCE; Schema: public; Owner: projectuser
--

CREATE SEQUENCE persona_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.persona_seq OWNER TO projectuser;

--
-- Name: persona_tbl; Type: TABLE; Schema: public; Owner: projectuser; Tablespace: 
--

CREATE TABLE persona_tbl (
    id bigint DEFAULT nextval('persona_seq'::regclass) NOT NULL,
    project_id bigint NOT NULL,
    name character varying NOT NULL,
    role character varying NOT NULL,
    description character varying
);


ALTER TABLE public.persona_tbl OWNER TO projectuser;

--
-- Name: project_seq; Type: SEQUENCE; Schema: public; Owner: projectuser
--

CREATE SEQUENCE project_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_seq OWNER TO projectuser;

--
-- Name: project_tbl; Type: TABLE; Schema: public; Owner: projectuser; Tablespace: 
--

CREATE TABLE project_tbl (
    id bigint DEFAULT nextval('project_seq'::regclass) NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.project_tbl OWNER TO projectuser;

--
-- Name: backlog_seq; Type: SEQUENCE SET; Schema: public; Owner: girvine
--

SELECT pg_catalog.setval('backlog_seq', 2, true);


--
-- Data for Name: backlog_tbl; Type: TABLE DATA; Schema: public; Owner: girvine
--

COPY backlog_tbl (id, project_id, name, description) FROM stdin;
1	1	B1	
2	1	B2	
\.


--
-- Name: hypothesis_seq; Type: SEQUENCE SET; Schema: public; Owner: projectuser
--

SELECT pg_catalog.setval('hypothesis_seq', 2, true);


--
-- Data for Name: hypothesis_tbl; Type: TABLE DATA; Schema: public; Owner: projectuser
--

COPY hypothesis_tbl (id, project_id, persona_id, outcome_id, description) FROM stdin;
1	1	1	1	View 1
2	1	1	1	View 2
\.


--
-- Name: outcome_seq; Type: SEQUENCE SET; Schema: public; Owner: projectuser
--

SELECT pg_catalog.setval('outcome_seq', 2, true);


--
-- Data for Name: outcome_tbl; Type: TABLE DATA; Schema: public; Owner: projectuser
--

COPY outcome_tbl (id, project_id, name, description) FROM stdin;
1	1	Remote Management	\N
2	1	R2	
\.


--
-- Name: persona_seq; Type: SEQUENCE SET; Schema: public; Owner: projectuser
--

SELECT pg_catalog.setval('persona_seq', 2, true);


--
-- Data for Name: persona_tbl; Type: TABLE DATA; Schema: public; Owner: projectuser
--

COPY persona_tbl (id, project_id, name, role, description) FROM stdin;
1	1	Shane	Ops Manager	\N
2	1	John	CEO	\N
\.


--
-- Name: project_seq; Type: SEQUENCE SET; Schema: public; Owner: projectuser
--

SELECT pg_catalog.setval('project_seq', 1, true);


--
-- Data for Name: project_tbl; Type: TABLE DATA; Schema: public; Owner: projectuser
--

COPY project_tbl (id, name) FROM stdin;
1	Jobs On Farm
\.


--
-- Name: backlog_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: girvine; Tablespace: 
--

ALTER TABLE ONLY backlog_tbl
    ADD CONSTRAINT backlog_tbl_pkey PRIMARY KEY (id);


--
-- Name: hypothesis_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: projectuser; Tablespace: 
--

ALTER TABLE ONLY hypothesis_tbl
    ADD CONSTRAINT hypothesis_tbl_pkey PRIMARY KEY (id);


--
-- Name: outcome_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: projectuser; Tablespace: 
--

ALTER TABLE ONLY outcome_tbl
    ADD CONSTRAINT outcome_tbl_pkey PRIMARY KEY (id);


--
-- Name: persona_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: projectuser; Tablespace: 
--

ALTER TABLE ONLY persona_tbl
    ADD CONSTRAINT persona_tbl_pkey PRIMARY KEY (id);


--
-- Name: project_tbl_pkey; Type: CONSTRAINT; Schema: public; Owner: projectuser; Tablespace: 
--

ALTER TABLE ONLY project_tbl
    ADD CONSTRAINT project_tbl_pkey PRIMARY KEY (id);


--
-- Name: backlog_project_fk; Type: FK CONSTRAINT; Schema: public; Owner: girvine
--

ALTER TABLE ONLY backlog_tbl
    ADD CONSTRAINT backlog_project_fk FOREIGN KEY (project_id) REFERENCES project_tbl(id);


--
-- Name: hypothesis_outcome_fk; Type: FK CONSTRAINT; Schema: public; Owner: projectuser
--

ALTER TABLE ONLY hypothesis_tbl
    ADD CONSTRAINT hypothesis_outcome_fk FOREIGN KEY (outcome_id) REFERENCES outcome_tbl(id);


--
-- Name: hypothesis_persona_fk; Type: FK CONSTRAINT; Schema: public; Owner: projectuser
--

ALTER TABLE ONLY hypothesis_tbl
    ADD CONSTRAINT hypothesis_persona_fk FOREIGN KEY (persona_id) REFERENCES persona_tbl(id);


--
-- Name: hypothesis_project_fk; Type: FK CONSTRAINT; Schema: public; Owner: projectuser
--

ALTER TABLE ONLY hypothesis_tbl
    ADD CONSTRAINT hypothesis_project_fk FOREIGN KEY (project_id) REFERENCES project_tbl(id);


--
-- Name: outcome_project_fk; Type: FK CONSTRAINT; Schema: public; Owner: projectuser
--

ALTER TABLE ONLY outcome_tbl
    ADD CONSTRAINT outcome_project_fk FOREIGN KEY (project_id) REFERENCES project_tbl(id);


--
-- Name: persona_project_fk; Type: FK CONSTRAINT; Schema: public; Owner: projectuser
--

ALTER TABLE ONLY persona_tbl
    ADD CONSTRAINT persona_project_fk FOREIGN KEY (project_id) REFERENCES project_tbl(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

