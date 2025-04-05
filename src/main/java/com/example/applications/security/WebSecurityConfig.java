package com.example.applications.security;


import com.example.applications.Services.UserDetailsServiceImpl;
import com.example.applications.jwt.AuthEntryPointJwt;
import com.example.applications.jwt.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        //securedEnabled = true,
        //jsr250Enabled = true,
        prePostEnabled = true)

public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    UserDetailsServiceImpl userDetailsService;
    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }
    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests().antMatchers("/api/auth/**").permitAll() // Permettre l'accès à /api/auth/**
                .antMatchers("/user/Add-user").permitAll() // Allow access to /sign-in without authentication
                .antMatchers("/fournisseur/getAllFournisseur").permitAll() // Remove token requirement
                .antMatchers("/commande/getAllCommande").permitAll() // Remove token requirement
                .antMatchers("/ressource/getAllRessource").permitAll() // Remove token requirement
                .antMatchers("/commande/getAllLigneCommandes").permitAll() // Remove token requirement
                .antMatchers("/commande/confirmation/**").permitAll() // Remove token requirement
                .antMatchers("/role/getAllRole").permitAll() // Allow access to /sign-in without authentication
                .antMatchers("/api/test/**").permitAll()
                .antMatchers("/api/password/request").permitAll() // Permettre l'accès à /api/password/request sans authentification
                .antMatchers("/push-notifications/**").permitAll() // Permettre l'accès à /api/password/request sans authentification
                .antMatchers("/api/password/reset").permitAll() // Permettre l'accès à /api/password/reset sans authentification
                .anyRequest().authenticated();
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
