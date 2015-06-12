package main

import (
  "os"
  "fmt"
  "net/http"
  "github.com/jmoiron/sqlx"
  _ "github.com/lib/pq"
  "github.com/gorilla/mux"
  "encoding/json"
  "io/ioutil"
  "bytes"
  )

/*
  "database/sql"
"encoding/base64"
"strings"
*/

type IdTuple struct {
  Id int
}

type StatusTuple struct {
  Id int
  Name string
}

type ProjectTuple struct {
  Id int
  Name string
}

type OutcomeTuple struct {
  Id int
  Project_id int
  Name string
  Description string
  Seq int
}

type PersonaTuple struct {
  Id int
  Project_id int
  Name string
  Role string
  Seq int
}

type HypothesisTuple struct {
  Id int
  Project_id int
  Outcome_id int
  Persona_id int
  Description string
  Testing string
  Importance int
  Uncertainty int
  Status_id int
  Seq int
}

func main() {

  /************************************************************************/
  connection_string := os.Getenv("DB")
  db, err := sqlx.Connect("postgres", connection_string)
  if err != nil {
    fmt.Printf("Error: %v\n", err)
    return
  }
  defer db.Close()

fmt.Println( "Here" )

  /************************************************************************/
  r := mux.NewRouter()

  /************************************************************************/
  r.HandleFunc("/ping", ping )

  /************************************************************************/
  r.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
    tuples := []StatusTuple{}
      var sql = `SELECT id, name
                 FROM status_tbl`
      db.Select(&tuples, sql)
      s, _ := json.Marshal(tuples)
      fmt.Fprintf(w, "%s\n", s)

  })

  /************************************************************************/
  r.HandleFunc("/project/{id}/outcome", func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("project.outcome.1")
    vars := mux.Vars(r)

    tuples := []OutcomeTuple{}
      var sql = `SELECT id, name, description, seq FROM outcome_tbl WHERE project_id=$1 ORDER BY seq`
      fmt.Println("project.outcome.1. $1", vars["id"])
      db.Select(&tuples, sql, vars["id"])
      s, _ := json.Marshal(tuples)
      fmt.Fprintf(w, "%s\n", s)

  }).Methods("GET")

  r.HandleFunc("/outcome/{id}", func(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)

    //Read POST body
    body, err := ioutil.ReadAll(r.Body);
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Parse POST body
    decoder := json.NewDecoder(bytes.NewBuffer(body))
    var p OutcomeTuple
    err = decoder.Decode(&p)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Write to DB
    tx := db.MustBegin()
    tx.MustExec("UPDATE outcome_tbl SET name=$1, description=$2, seq=$3 WHERE id=$4", p.Name, p.Description, p.Seq, vars["id"] )

    tx.Commit()

  }).Methods("POST")

  r.HandleFunc("/outcome", func(w http.ResponseWriter, r *http.Request) {
    //Read POST body
    body, err := ioutil.ReadAll(r.Body);
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Parse POST body
    decoder := json.NewDecoder(bytes.NewBuffer(body))
    var o OutcomeTuple
    err = decoder.Decode(&o)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Write to DB
    tx := db.MustBegin()
    var sql = "INSERT INTO outcome_tbl( id, project_id, name, description, seq ) VALUES ( NEXTVAL( 'outcome_seq' ), $1, $2, $3, $4 )"
    tx.MustExec(sql, o.Project_id, o.Name, o.Description, o.Seq)

    var id IdTuple
    db.Get(&id, "SELECT CURRVAL( 'outcome_seq' ) AS id")
    fmt.Fprintf(w, "%s", id.Id)

    tx.Commit()

  }).Methods("POST")

  /************************************************************************/
  r.HandleFunc("/project/{id}/persona", func(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)

    tuples := []PersonaTuple{}
      var sql = `SELECT id, name, role, seq FROM persona_tbl WHERE project_id=$1 ORDER BY seq`
      db.Select(&tuples, sql, vars["id"])
      s, _ := json.Marshal(tuples)
      fmt.Fprintf(w, "%s\n", s)

  }).Methods("GET")

  r.HandleFunc("/persona/{id}", func(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)

    //Read POST body
    body, err := ioutil.ReadAll(r.Body);
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Parse POST body
    decoder := json.NewDecoder(bytes.NewBuffer(body))
    var p PersonaTuple
    err = decoder.Decode(&p)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Write to DB
    tx := db.MustBegin()
    tx.MustExec("UPDATE persona_tbl SET name=$1, role=$2, seq=$3 WHERE id=$4", p.Name, p.Role, p.Seq, vars["id"] )

    tx.Commit()

  }).Methods("POST")

  r.HandleFunc("/persona", func(w http.ResponseWriter, r *http.Request) {
    //Read POST body
    body, err := ioutil.ReadAll(r.Body);
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Parse POST body
    decoder := json.NewDecoder(bytes.NewBuffer(body))
    var p PersonaTuple
    err = decoder.Decode(&p)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Write to DB
    tx := db.MustBegin()
    var sql = "INSERT INTO persona_tbl( id, project_id, name, role, seq ) VALUES ( NEXTVAL( 'persona_seq' ), $1, $2, $3, $4 )"
    tx.MustExec(sql, p.Project_id, p.Name, p.Role, p.Seq)

    var id IdTuple
    db.Get(&id, "SELECT CURRVAL( 'persona_seq' ) AS id")
    fmt.Fprintf(w, "%s", id.Id)

    tx.Commit()

  }).Methods("POST")


  /************************************************************************/
  r.HandleFunc("/project/{id}/hypothesis", func(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)

    fmt.Println( "/project/{id}/hypothesis.1 ", vars["id"] )

    tuples := []HypothesisTuple{}

      var sql = "SELECT h.id, h.outcome_id, h.persona_id, h.description, h.testing, h.importance, h.uncertainty, h.status_id, h.seq FROM hypothesis_tbl h WHERE h.project_id=$1 ORDER BY seq"

      var err=db.Select(&tuples, sql, vars["id"])
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
    body, err := ioutil.ReadAll(r.Body);
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Parse POST body
    decoder := json.NewDecoder(bytes.NewBuffer(body))
    var h HypothesisTuple
    err = decoder.Decode(&h)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Write to DB
    tx := db.MustBegin()
    var sql = "UPDATE hypothesis_tbl SET outcome_id=$1, persona_id=$2, description=$3, testing=$4, status_id=$5, seq=$6 WHERE id = $7"
    tx.MustExec(sql, h.Outcome_id, h.Persona_id, h.Description, h.Testing, h.Status_id, h.Seq, vars["id"] )

    tx.Commit()

  }).Methods("POST")

  r.HandleFunc("/hypothesis", func(w http.ResponseWriter, r *http.Request) {
    //Read POST body
    body, err := ioutil.ReadAll(r.Body);
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Parse POST body
    decoder := json.NewDecoder(bytes.NewBuffer(body))
    var h HypothesisTuple
    err = decoder.Decode(&h)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Write to DB
    tx := db.MustBegin()
    var sql = "INSERT INTO hypothesis_tbl( id, project_id, outcome_id, persona_id, description, testing, status_id, seq ) VALUES ( NEXTVAL( 'hypothesis_seq' ), $1, $2, $3, $4, $5, $6, $7 )"
    tx.MustExec(sql, h.Project_id, h.Outcome_id, h.Persona_id, h.Description, h.Testing, h.Status_id, h.Seq)

    var id IdTuple
    db.Get(&id, "SELECT CURRVAL( 'hypothesis_seq' ) AS id")
    fmt.Fprintf(w, "%s", id.Id)

    tx.Commit()

  }).Methods("POST")

  /************************************************************************/
  r.HandleFunc("/project", func(w http.ResponseWriter, r *http.Request) {
    tuples := []ProjectTuple{}
      var sql = `SELECT id, name
                 FROM project_tbl`
      db.Select(&tuples, sql)
      s, _ := json.Marshal(tuples)
      fmt.Fprintf(w, "%s\n", s)

  })

  r.HandleFunc("/project/{id}", func(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)

    p := ProjectTuple{}
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
    body, err := ioutil.ReadAll(r.Body);
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Parse POST body
    decoder := json.NewDecoder(bytes.NewBuffer(body))
    var p ProjectTuple
    err = decoder.Decode(&p)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Write to DB
    tx := db.MustBegin()
    tx.MustExec("UPDATE project_tbl SET name = $1 WHERE id = $2", p.Name, vars["id"] )

    tx.Commit()

  }).Methods("POST")

  r.HandleFunc("/project", func(w http.ResponseWriter, r *http.Request) {
    //Read POST body
    body, err := ioutil.ReadAll(r.Body);
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Parse POST body
    decoder := json.NewDecoder(bytes.NewBuffer(body))
    var p PersonaTuple
    err = decoder.Decode(&p)
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }

    //Write to DB
    tx := db.MustBegin()
    var sql = "INSERT INTO project_tbl( id, name ) VALUES ( NEXTVAL( 'project_seq' ), $1 )"
    tx.MustExec(sql, p.Name)

    var id IdTuple
    db.Get(&id, "SELECT CURRVAL( 'project_seq' ) AS id")
    fmt.Fprintf(w, "%s", id.Id)

    tx.Commit()

  }).Methods("POST")

  /************************************************************************/
  r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))

  /************************************************************************/
  http.Handle("/", r)
  fmt.Println( http.ListenAndServe("0.0.0.0:5001", nil) )

fmt.Println( "Here.End" )
}

/************************************************************************/
func ping(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "ping-get")

}
