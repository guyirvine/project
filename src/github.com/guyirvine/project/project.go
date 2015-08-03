package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

/*
  "database/sql"
"encoding/base64"
"strings"
*/

type idTuple struct {
	ID int
}

type statusTuple struct {
	ID   int
	Name string
}

type projectTuple struct {
	ID   int
	Name string
}

type outcomeTuple struct {
	ID          int
	ProjectID   int
	Name        string
	Description string
	Seq         int
}

type personaTuple struct {
	ID        int
	ProjectID int
	Name      string
	Role      string
	Seq       int
}

type hypothesisTuple struct {
	ID          int
	ProjectID   int
	OutcomeID   int
	PersonaID   int
	Description string
	Testing     string
	Importance  int
	Uncertainty int
	StatusID    int
	Seq         int
}

type streamTuple struct {
	ID   int
	Name string
}

type taskTuple struct {
	ID   int
	StreamID int
	StatusID int
	Name string
}


func main() {

	/************************************************************************/
	connectionString := os.Getenv("DB")
	db, err := sqlx.Connect("postgres", connectionString)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer db.Close()

	fmt.Println("Starting up")

	/************************************************************************/
	r := mux.NewRouter()

	/************************************************************************/
	r.HandleFunc("/ping", ping)

	/************************************************************************/
	r.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		tuples := []statusTuple{}
		var sql = `SELECT id, name
                 FROM status_tbl`
		db.Select(&tuples, sql)
		s, _ := json.Marshal(tuples)
		fmt.Fprintf(w, "%s\n", s)

	})

	/************************************************************************/
	r.HandleFunc("/project/{id}/outcome", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		tuples := []outcomeTuple{}
		var sql = `SELECT id, name, description, seq FROM outcome_tbl WHERE project_id=$1 ORDER BY seq`
		db.Select(&tuples, sql, vars["id"])
		s, _ := json.Marshal(tuples)
		fmt.Fprintf(w, "%s\n", s)

	}).Methods("GET")

	r.HandleFunc("/outcome/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p outcomeTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		tx.MustExec("UPDATE outcome_tbl SET name=$1, description=$2, seq=$3 WHERE id=$4", p.Name, p.Description, p.Seq, vars["id"])

		tx.Commit()

	}).Methods("POST")

	r.HandleFunc("/outcome", func(w http.ResponseWriter, r *http.Request) {
		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var o outcomeTuple
		err = decoder.Decode(&o)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		var sql = "INSERT INTO outcome_tbl( id, project_id, name, description, seq ) VALUES ( NEXTVAL( 'outcome_seq' ), $1, $2, $3, $4 )"
		tx.MustExec(sql, o.ProjectID, o.Name, o.Description, o.Seq)

		var id idTuple
		db.Get(&id, "SELECT CURRVAL( 'outcome_seq' ) AS id")
		fmt.Fprintf(w, "%d", id.ID)

		tx.Commit()

	}).Methods("POST")

	/************************************************************************/
	r.HandleFunc("/project/{id}/persona", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		tuples := []personaTuple{}
		var sql = `SELECT id, name, role, seq FROM persona_tbl WHERE project_id=$1 ORDER BY seq`
		db.Select(&tuples, sql, vars["id"])
		s, _ := json.Marshal(tuples)
		fmt.Fprintf(w, "%s\n", s)

	}).Methods("GET")

	r.HandleFunc("/persona/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p personaTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		tx.MustExec("UPDATE persona_tbl SET name=$1, role=$2, seq=$3 WHERE id=$4", p.Name, p.Role, p.Seq, vars["id"])

		tx.Commit()

	}).Methods("POST")

	r.HandleFunc("/persona", func(w http.ResponseWriter, r *http.Request) {
		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p personaTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		var sql = "INSERT INTO persona_tbl( id, project_id, name, role, seq ) VALUES ( NEXTVAL( 'persona_seq' ), $1, $2, $3, $4 )"
		tx.MustExec(sql, p.ProjectID, p.Name, p.Role, p.Seq)

		var id idTuple
		db.Get(&id, "SELECT CURRVAL( 'persona_seq' ) AS id")
		fmt.Fprintf(w, "%d", id.ID)

		tx.Commit()

	}).Methods("POST")

	/************************************************************************/
	r.HandleFunc("/project/{id}/hypothesis", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		tuples := []hypothesisTuple{}

		var sql = "SELECT h.id, h.outcome_id AS OutcomeID, h.persona_id AS PersonaID, h.description, h.testing, h.importance, h.uncertainty, h.status_id AS StatusID, h.seq FROM hypothesis_tbl h WHERE h.project_id=$1 ORDER BY seq"

		var err = db.Select(&tuples, sql, vars["id"])
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		s, _ := json.Marshal(tuples)
		fmt.Fprintf(w, "%s\n", s)

	}).Methods("GET")

	r.HandleFunc("/hypothesis/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var h hypothesisTuple
		err = decoder.Decode(&h)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		var sql = "UPDATE hypothesis_tbl SET OutcomeID=$1, PersonaID=$2, description=$3, testing=$4, StatusID=$5, seq=$6 WHERE id = $7"
		tx.MustExec(sql, h.OutcomeID, h.PersonaID, h.Description, h.Testing, h.StatusID, h.Seq, vars["id"])

		tx.Commit()

	}).Methods("POST")

	r.HandleFunc("/hypothesis", func(w http.ResponseWriter, r *http.Request) {
		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var h hypothesisTuple
		err = decoder.Decode(&h)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		var sql = "INSERT INTO hypothesis_tbl( id, project_id, OutcomeID, PersonaID, description, testing, StatusID, seq ) VALUES ( NEXTVAL( 'hypothesis_seq' ), $1, $2, $3, $4, $5, $6, $7 )"
		tx.MustExec(sql, h.ProjectID, h.OutcomeID, h.PersonaID, h.Description, h.Testing, h.StatusID, h.Seq)

		var id idTuple
		db.Get(&id, "SELECT CURRVAL( 'hypothesis_seq' ) AS id")
		fmt.Fprintf(w, "%d", id.ID)

		tx.Commit()

	}).Methods("POST")

	/************************************************************************/
	r.HandleFunc("/project", func(w http.ResponseWriter, r *http.Request) {
		tuples := []projectTuple{}
		var sql = `SELECT id, name
                 FROM project_tbl`
		db.Select(&tuples, sql)
		s, _ := json.Marshal(tuples)
		fmt.Fprintf(w, "%s\n", s)

	}).Methods("GET")

	r.HandleFunc("/project/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		p := projectTuple{}
		var sql = `SELECT id, name
                 FROM project_tbl
                 WHERE id=$1`
		db.Get(&p, sql, vars["id"])
		s, _ := json.Marshal(p)
		fmt.Fprintf(w, "%s\n", s)

	}).Methods("GET")

	r.HandleFunc("/project/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p projectTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		tx.MustExec("UPDATE project_tbl SET name = $1 WHERE id = $2", p.Name, vars["id"])

		tx.Commit()

	}).Methods("POST")

	r.HandleFunc("/project", func(w http.ResponseWriter, r *http.Request) {
		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p personaTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		var sql = "INSERT INTO project_tbl( id, name ) VALUES ( NEXTVAL( 'project_seq' ), $1 )"
		tx.MustExec(sql, p.Name)

		var id idTuple
		db.Get(&id, "SELECT CURRVAL( 'project_seq' ) AS id")
		fmt.Fprintf(w, "%d", id.ID)

		tx.Commit()

	}).Methods("POST")


	/************************************************************************/
	r.HandleFunc("/stream", func(w http.ResponseWriter, r *http.Request) {
		tuples := []streamTuple{}
		var sql = `SELECT id, name
                 FROM stream_tbl`
		db.Select(&tuples, sql)
		s, _ := json.Marshal(tuples)
		fmt.Fprintf(w, "%s\n", s)

	}).Methods("GET")

	r.HandleFunc("/stream/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p streamTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		tx.MustExec("UPDATE stream_tbl SET name = $1 WHERE id = $2", p.Name, vars["id"])

		tx.Commit()

	}).Methods("POST")

	r.HandleFunc("/stream", func(w http.ResponseWriter, r *http.Request) {
		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p streamTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		var sql = "INSERT INTO stream_tbl( id, name ) VALUES ( NEXTVAL( 'stream_seq' ), $1 )"
		tx.MustExec(sql, p.Name)

		var id idTuple
		db.Get(&id, "SELECT CURRVAL( 'stream_seq' ) AS id")
		fmt.Fprintf(w, "%d", id.ID)

		tx.Commit()

	}).Methods("POST")

	/************************************************************************/
	r.HandleFunc("/task", func(w http.ResponseWriter, r *http.Request) {
		tuples := []taskTuple{}
		var sql = `SELECT id, stream_id AS StreamID, status_id AS StatusID, name
                 FROM task_tbl`
		db.Select(&tuples, sql)
		s, _ := json.Marshal(tuples)
		fmt.Fprintf(w, "%s\n", s)

	}).Methods("GET")

	r.HandleFunc("/task/{id}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p taskTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		tx.MustExec("UPDATE task_tbl SET stream_id = $1, name = $2 WHERE id = $3", p.StreamID, p.Name, vars["id"])

		tx.Commit()

	}).Methods("POST")

	r.HandleFunc("/task", func(w http.ResponseWriter, r *http.Request) {
		//Read POST body
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Parse POST body
		decoder := json.NewDecoder(bytes.NewBuffer(body))
		var p taskTuple
		err = decoder.Decode(&p)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		//Write to DB
		tx := db.MustBegin()
		var sql = "INSERT INTO task_tbl( id, stream_id, name ) VALUES ( NEXTVAL( 'task_seq' ), $1, $2 )"
		tx.MustExec(sql, p.StreamID, p.Name)

		var id idTuple
		db.Get(&id, "SELECT CURRVAL( 'task_seq' ) AS id")
		fmt.Fprintf(w, "%d", id.ID)

		tx.Commit()

	}).Methods("POST")

	/************************************************************************/
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))

	/************************************************************************/
	http.Handle("/", r)
	fmt.Println(http.ListenAndServe("0.0.0.0:5001", nil))

}

/************************************************************************/
func ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "ping-get")

}
