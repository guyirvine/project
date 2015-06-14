function DataAccess() {
  var self = this;

  /****************************************************************************/
  self.update_project = function(p, callback) {
    data = {
      name: p.name()
    };

    if ( p.id === null ) {
      console.log( 'update_project.id: null' );
      $.post( "/project", JSON.stringify(data), function(id) {
        callback(id);
      });
    } else {
      console.log( 'update_project.id: ', p.id );
      $.post( "/project/" + p.id, JSON.stringify(data), function() {
      });
      callback(p.id);
    }
  };

  /****************************************************************************/
  self.update_outcome = function(o, callback) {
    data = {
      project_id: o.project().id,
      name: o.name(),
      description: o.description(),
      seq: o.seq
    };

    if ( o.id === null ) {
      $.post( "/outcome", JSON.stringify(data), function(id) {
        callback(id);
      });
    } else {
      $.post( "/outcome/" + o.id, JSON.stringify(data), function() {
        callback(o.id);
      });
    }
  };

  /****************************************************************************/
  self.update_persona = function(p, callback) {
    data = {
      project_id: p.project().id,
      name: p.name(),
      role: p.role(),
      seq: p.seq
    };

    if ( p.id === null ) {
      $.post( "/persona", JSON.stringify(data), function(id) {
        callback(id);
      });
    } else {
      $.post( "/persona/" + p.id, JSON.stringify(data), function() {
        callback(p.id);
      });
    }
  };

  /****************************************************************************/
  self.update_hypothesis = function(h) {
    data = {
      project_id: h.project().id,
      outcome_id: h.outcome().id,
      persona_id: h.persona().id,
      description: h.description(),
      testing: h.testing(),
      status_id: h.status().id,
      seq: h.seq
    };

    if ( h.id === null ) {
      $.post( "/hypothesis", JSON.stringify(data), function(id) {
        h.id=id;
      });
    } else {
      $.post( "/hypothesis/" + h.id, JSON.stringify(data), function() {
      });
    }
  };

  /****************************************************************************/
  self.get_for_project = function(id) {
    if ( vm.current_project() !== undefined ) {
      vm.current_project().selected( false );
    }
    $.when(
      $.get('/project/' + id + '/outcome'),
      $.get('/project/' + id + '/persona'),
      $.get('/project/' + id + '/hypothesis')
    ).done(function( outcome_data, persona_data, hypothesis_data ) {
      vm.current_project( vm.project_idx[id] );
      vm.current_project().selected( true );

      vm.outcome_list.removeAll();
      vm.add_outcome( new Outcome( null, vm.current_project(), "", "", 0 ) );
      console.log( "outcome_data[0]: ", outcome_data[0] );
      _.each(JSON.parse( outcome_data[0] ), function(el) {
        vm.add_outcome( new Outcome( el.ID, vm.current_project(), el.Name, el.Description, Number(el.Seq) ) );
      });

      vm.persona_list.removeAll();
      vm.add_persona(new Persona( null, vm.current_project(), "", "", 0 ));
      _.each(JSON.parse( persona_data[0] ), function(el) {
        vm.add_persona(new Persona( el.ID, vm.current_project(), el.Name, el.Role, Number(el.Seq) ));
      });

      vm.hypothesis_list.removeAll();
      _.each( JSON.parse( hypothesis_data[0] ), function(el) {
        var o=vm.outcome_idx[el.OutcomeID];
        var p=vm.persona_idx[el.PersonaID];
        var st=vm.status_idx[el.StatusID];

        var i=vm.range_idx[el.Importance];
        var u=vm.range_idx[el.Uncertainty];

        vm.add_hypothesis(new Hypothesis(el.Id, vm.current_project(), o, p, el.Description, el.Testing, i, u, st, Number(el.Seq)));
      });
    });
  };

}
